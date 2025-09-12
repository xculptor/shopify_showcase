function resetOrbitControls (experience, camera, orbitControls) {

    camera.position.x = Number(experience.cameras[0].camera_position.x)
    camera.position.y = Number(experience.cameras[0].camera_position.y)
    camera.position.z = Number(experience.cameras[0].camera_position.z)

    orbitControls.target.x = Number(experience.orbit_control.target.x)
    orbitControls.target.y = Number(experience.orbit_control.target.y)
    orbitControls.target.z = Number(experience.orbit_control.target.z)
    

}

export default resetOrbitControls