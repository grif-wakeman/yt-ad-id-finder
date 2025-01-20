const ytLink = document.getElementById("yt-link");
const embeddedVideo = document.getElementById("embedded-video");
const statusText = document.getElementById("status-text");
const videoUnavailable = document.getElementById("video-unavailable");

embeddedVideo.style.display = "none";
videoUnavailable.style.display = "none";


function getValuesFromPlist(plistData, keys) {
  if (!plistData || typeof plistData !== "string") {
    console.error("Invalid plistData: Input is null, undefined, or not a string.");
    return null;
  }

  const results = {};

  keys.forEach((key) => {
    const regex = new RegExp(`${key}\\s*=\\s*([^;]+);`);
    const match = plistData.match(regex);

    if (match) {
      let value = match[1].trim();

      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      results[key] = value;
    } else {
      console.error(`Key "${key}" not found in plistData.`);
      results[key] = null;
      statusText.innerHTML = `Error: Incorrect paste. Did you copy the Debug Info?`;
      statusText.style.color = "red";
      ytLink.text = "";
      ytLink.href = "";
      embeddedVideo.src = "";
      embeddedVideo.style.display = "none";
    }
  });

  return results;
}



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
      console.log("parsable but not an ad");
      
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
      videoUnavailable.style.display = "block";
    }
  } catch (e) {
    /* console.log("It's not parsable!");
    statusText.innerHTML = `Error: Incorrect paste. Did you copy the Debug Info?`;
    statusText.style.color = "red";
    ytLink.text = "";
    ytLink.href = "";
    embeddedVideo.src = "";
    embeddedVideo.style.display = "none"; */
    console.log("It's not parsable!")

    const plistData = pastedText;

    if (plistData) {
      const keysToFind = ["docid", "videoID"]; // Keys to extract
      const values = getValuesFromPlist(plistData, keysToFind);
      console.log(values);
      

      if (!values.docid || !values.videoID) {
        console.log("values are null. Not debug info.");

        statusText.innerHTML = `Error: Incorrect paste. Did you copy the Debug Info?`;
        statusText.style.color = "red";
        ytLink.text = "";
        ytLink.href = "";
        embeddedVideo.src = "";
        embeddedVideo.style.display = "none";
        
      } else {
        if (values.docid !== values.videoID) {
          console.log("values are not null. It's an ad.");
          statusText.innerHTML = "Success!";
          statusText.style.color = "#2DAF9B";
          ytLink.text = `https://www.youtube.com/watch?v=${values.docid}`;
          ytLink.href = `https://www.youtube.com/watch?v=${values.docid}`;
          embeddedVideo.src = `https://www.youtube.com/embed/${values.docid}`;
          embeddedVideo.style.display = "block";
          videoUnavailable.style.display = "block";

        } else {
          console.log("values are not null, but it's not an ad.");
          
          statusText.innerHTML = `Error: Debug Info copied. Not an Ad.`;
          statusText.style.color = "red";
          ytLink.text = "";
          ytLink.href = "";
          embeddedVideo.src = "";
          embeddedVideo.style.display = "none";
        }
      }


    } else {
      console.log("Plist data was not provided.");
    }


  }
}

// Attach the event listener to the desired element
const targetElement = document.getElementById("textbox");
targetElement.addEventListener("paste", handlePaste);
