const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "sk-proj-Np51Xvk5TEKIY3BbZQ2JT3BlbkFJ055QmCpTU9Rbf4ZuHt4h"; // Your OpenAI API key here
let isImageGenerating = false;


const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    
    // Set the image source to the AI-generated image data
    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;
    
    // When the image is loaded, remove the loading class and set download attributes
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    }
  });
}
const openaiUrl = 'https://api.openai.com/v1/images';

async function generateImage(promptText, usrImgQuantity) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`

        },
        body: JSON.stringify({
            prompt: promptText,
            max_tokens: 50, // Adjust max_tokens as needed
            temperature: 0.7, // Adjust temperature as needed
            model: 'clip-dall-e', // Use the model of your choice
            image_type: 'multimodal', // Type of image to generate
            n: usrImgQuantity // Number of images to generate
        })
    };


    try {
        const response = await fetch(openaiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to generate image');
        }
        const responseData = await response.json();
        const imageUrl = responseData.images[0].output_url;
        return imageUrl;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
const handleImageGeneration = (e) => {
  e.preventDefault();
  if(isImageGenerating) return;

  // Get user input and image quantity values
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = parseInt(e.srcElement[1].value);
  
  // Disable the generate button, update its text, and set the flag
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;
  
  // Creating HTML markup for image cards with loading state
  const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
      `<div class="img-card loading">
        <img src="images/loader.svg" alt="AI generated image">
        <a class="download-btn" href="#">
          <img src="images/download.svg" alt="download icon">
        </a>
      </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateImage(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);