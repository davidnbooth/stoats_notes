const follower = document.getElementById("follower");

document.body.onpointermove = (event) => {
    const { clientX, clientY } = event;
    if (follower?.style) {
        follower.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 1500, fill: "forwards" });
    }
};

