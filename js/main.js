document.querySelector("#search_button").addEventListener('click', sendIdentification)

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
        api_key: "xNuc6x9ITxnDVN1gNckvQxoBQHyJVwUVu8bJCGux5QaYIxr5ud",
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
        // console.log(data.suggestions[0].plant_details.common_names)
        // console.log(data.suggestions[0].plant_details.scientific_name)
        // console.log(data.suggestions[0].plant_details.url)

        var commonName = document.createElement("h2")
        var commonNameText = document.createTextNode(data.suggestions[0].plant_name)
        commonName.appendChild(commonNameText)
        var commonNameElement = document.getElementById('plant_information')
        commonNameElement.appendChild(commonName)

        // var scientificName = document.createElement("p")
        // var text = document.createTextNode(data.suggestions[0].plant_details.scientific_name)
        // scientificName.appendChild(text)
        // var element = document.getElementById('plant_information')
        // element.appendChild(scientificName)

        var img = document.createElement("img")
        img.src = data.suggestions[0].similar_images[0].url
        var src = document.getElementById('plant_information')
        src.appendChild(img)

        var wikiTagSection = document.getElementById('plant_information')
        var plantWikiTag = document.createElement("a")
        plantWikiTag.setAttribute('href', data.suggestions[0].plant_details.url)
        plantWikiTag.innerText = "Want to know more about your plant?"
        wikiTagSection.appendChild(plantWikiTag)

      })
      .catch((error) => {
        console.error('Error:', error);
      });
    })

}
