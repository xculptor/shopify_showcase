const WaterReflectorShader = {

	name: 'WaterReflectorShader',

	uniforms: {		

	},

	vertexShader: /* glsl */ `
        #include <common>
        #include <shadowmap_pars_vertex>
        #include <logdepthbuf_pars_vertex>

        uniform mat4 textureMatrix;

        varying vec2 vUv;  
		varying vec4 vUvProj;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec4 vClipSpacePosition; 	
		

		void main() {

			vUvProj = textureMatrix * vec4( position, 1.0 );

            vUv = uv;  
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vClipSpacePosition = projectionMatrix * mvPosition; 

			gl_Position = vClipSpacePosition;

			#include <logdepthbuf_vertex>

             //code for shadow

            vec4 worldPosition = modelMatrix * vec4(position, 1.0);

            vec3 shadowWorldNormal = inverseTransformDirection( vNormal, viewMatrix );
            vec4 shadowWorldPosition;

            #if NUM_DIR_LIGHT_SHADOWS > 0

            #pragma unroll_loop_start
            for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

                shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
                vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;

            }
            #pragma unroll_loop_end

            #endif

		}
    `,

    fragmentShader: /* glsl */ `
        #include <common>
        #include <packing>
        #include <lights_pars_begin>
        #include <shadowmap_pars_fragment>
        #include <shadowmask_pars_fragment>

        uniform vec3 color;
		uniform sampler2D tDiffuse;
        uniform sampler2D _baseTex;
        uniform sampler2D _bufferTex;        
        uniform vec3 _albedoColor;  
        uniform float _alpha;    
        uniform float _shininess;
        uniform float _metallic;
        uniform float _reflection;
        uniform bool _receiveShadow;
		
        varying vec2 vUv;  
        varying vec4 vUvProj;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec4 vClipSpacePosition;    

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			vec2 uv = vUv;
            vec3 ndc = vClipSpacePosition.xyz / vClipSpacePosition.w;           
            vec2 screenUv = (ndc.xy + 1.0) / 2.0;

            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            vec3 albedo = _albedoColor;
            vec3 mate = vec3(0.18) * albedo;

            // shadow map
            DirectionalLightShadow directionalShadow1 = directionalLightShadows[0];        

            float shadow = 1.0;
            shadow *= getShadow(
                directionalShadowMap[0],
                directionalShadow1.shadowMapSize, 1.0,
                directionalShadow1.shadowBias,
                directionalShadow1.shadowRadius,
                vDirectionalShadowCoord[0]
            ) + 0.005;       

            float shadowValue = _receiveShadow ? shadow : 1.0;        
                
            float sunDiffuse = 0.0;
            vec3 diffuseCol = vec3(0.0);
            vec3 specular = vec3(0.0);

            for (int i = 0; i < NUM_DIR_LIGHTS; i++){
                //diffuse            
                vec3 lightdir = directionalLights[i].direction;
                float sunDiffuse = clamp(dot(normal, lightdir), 0.0, 1.0);
                
                diffuseCol += mate * directionalLights[i].color * sunDiffuse * 3.0 * shadowValue;

                // specular        
                vec3 reflectDir = reflect(-lightdir, normal);  
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), _shininess * 128.0);   
                specular += vec3(1.0) * spec * 1.5 * _metallic * directionalLights[i].color.r;   
            }       
            
            vec4 bufferData = texture(_bufferTex, uv);
            vec4 ScreenCol = texture(_baseTex, screenUv + bufferData.zw * 0.2);  
            diffuseCol = mix(ScreenCol.xyz, diffuseCol, _alpha);

            // Ambient, sky, and bounce lighting
            float skyDiffuse = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);// * (1.0 - metallic); 
            float bounceDiffuse = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);     
            diffuseCol += mate * ambientLightColor * skyDiffuse;
            diffuseCol += mate * vec3(0.7, 0.3, 0.2) * bounceDiffuse * (1.0 - _metallic);         

            // Final color computation
            vec3 finalcol = (diffuseCol + mix(vec3(0.0), specular, shadowValue)); 
            
			vec4 reflectionColor = texture2DProj( tDiffuse, vUvProj + bufferData * 0.01);
            reflectionColor =  linearToOutputTexel( reflectionColor ) * 0.7;
            finalcol = mix(finalcol, reflectionColor.rgb, _reflection);
			

			vec3 waterNormal = normalize(vec3(-bufferData.z, 0.2, -bufferData.w));
            finalcol += vec3(1) * pow(max(0.0, dot(waterNormal, normalize(vec3(-3, 10, 3)))), 60.0 * 1.) * directionalLights[0].color;

            finalcol = pow(finalcol, vec3(0.4545)); // gamma correction
                    
            gl_FragColor = vec4(finalcol, 1.0);

		}
    `,
    lights: true

};

export { WaterReflectorShader };
