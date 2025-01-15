const ytLink = document.getElementById("yt-link");
const embeddedVideo = document.getElementById("embedded-video");
const statusText = document.getElementById("status-text");

embeddedVideo.style.display = "none";



function handlePaste(event) {
  // Prevent the default paste behavior
  event.preventDefault();

  // Access the clipboard data
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text");
  console.log(pastedText);

  try {
    let jsonData = JSON.parse(pastedText);
    console.log("It's parsable!");

    if (!jsonData.addebug_videoId) {
      statusText.innerHTML = `Error: Debug Info copied. Not an Ad.`;
      statusText.style.color = "red";
      ytLink.text = "";
      ytLink.href = "";
      embeddedVideo.src = "";
      embeddedVideo.style.display = "none";

      return;
    } else {
      console.log(jsonData.addebug_videoId);
      statusText.innerHTML = "Success!";
      statusText.style.color = "#2DAF9B";
      ytLink.text = `https://www.youtube.com/watch?v=${jsonData.addebug_videoId}`;
      ytLink.href = `https://www.youtube.com/watch?v=${jsonData.addebug_videoId}`;
      embeddedVideo.src = `https://www.youtube.com/embed/${jsonData.addebug_videoId}`;
      embeddedVideo.style.display = "block";
    }
  } catch (e) {
    console.log("It's not parsable!");
    statusText.innerHTML = `Error: Incorrect paste. Did you copy the Debug Info?`;
    statusText.style.color = "red";
    ytLink.text = "";
      ytLink.href = "";
      embeddedVideo.src = "";
      embeddedVideo.style.display = "none";
  }
}

// Attach the event listener to the desired element
const targetElement = document.getElementById("textbox");
targetElement.addEventListener("paste", handlePaste);
