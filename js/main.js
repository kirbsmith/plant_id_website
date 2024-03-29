document.querySelector("#search_button").addEventListener('click', sendIdentification)
document.querySelector("#search_button").addEventListener('click', waitTime)
document.querySelector("#past_searches").addEventListener('click', getHistory)

const btn = document.getElementById("search_button")
function waitTime() {
  btn.disabled = true;
  setTimeout(()=>{
    btn.disabled = false;
    console.log('Button Activated')}, 5000)
}

function sendIdentification() {
    const files = [...document.querySelector('input[type=file]').files];
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = event.target.result;
            console.log(res);
            resolve(res);
          }
          reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then((base64files) => {
      console.log(base64files)

      const data = {
        // api key goes below this line
        api_key: 'xNuc6x9ITxnDVN1gNckvQxoBQHyJVwUVu8bJCGux5QaYIxr5ud',
        images: base64files,
        // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
        plant_details: ["common_names",
                        "url",
                        "name_authority",
                        "wiki_description",
                        "taxonomy",
                        "synonyms"],
      };

      fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)

        var commonName = document.createElement("h2")
        var commonNameText = document.createTextNode(data.suggestions[0].plant_name)
        commonName.appendChild(commonNameText)
        var commonNameElement = document.getElementById('plant_information')
        commonNameElement.appendChild(commonName)

        var confidencePercentageParagraph = document.createElement("p")
        var confidenceRatio = data.suggestions[0].probability
        var confidencePercentage = document.createTextNode(Math.trunc(confidenceRatio * 100) + "% Confidence in Result")
        console.log(confidencePercentage)
        confidencePercentageParagraph.appendChild(confidencePercentage)
        var confidencePercentageElement = document.getElementById('plant_information')
        confidencePercentageElement.appendChild(confidencePercentageParagraph)

        var img = document.createElement("img")
        img.src = data.suggestions[0].similar_images[0].url
        var src = document.getElementById('plant_information')
        src.appendChild(img)

        var wikiTagSection = document.getElementById('plant_information')
        var plantWikiTag = document.createElement("a")
        plantWikiTag.setAttribute('href', data.suggestions[0].plant_details.url)
        plantWikiTag.setAttribute('target', '_blank')
        plantWikiTag.innerText = "Want to know more about your plant?"
        wikiTagSection.appendChild(plantWikiTag)

        if(!localStorage.getItem('plants')){
          localStorage.setItem('plants', data.suggestions[0].plant_name)
        } else{
          let plants = localStorage.getItem('plants') + " " + data.suggestions[0].plant_name
          localStorage.setItem('plants', plants)
        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });
    })

}

function getHistory(){
  if(!localStorage.getItem('plants')){
    var noSearches = document.createElement("p")
    noSearches.innerText = "There have been no previous searches on this device"
    var noSearchesSection = document.getElementById("past_searches_section")
    noSearchesSection.innerText = noSearches
    noSearchesSection.appendChild(noSearches)
  } else{
    var searches = document.createElement("p")
    searches.innerText = "You have searched for these plants on this device:"
    var searchesSection = document.getElementById("past_searches_section")
    searchesSection.innerText = searches
    searchesSection.appendChild(searches)
  }
}
