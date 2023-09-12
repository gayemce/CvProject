/* --- Information from the API is received --- */
get();

function get(){
    document.getElementById("content").style.display = "none";
    document.getElementById("content-loading").style.display = "block";
    document.getElementById("error").style.display = "none";
    axios.get("http://localhost:5500/api/get")
        .then(res => {
            const myData = res.data;
            setMyInformation(myData.person)
            setMySkills(myData.skills)
            setMySocialMedias(myData.socialMedias)
            setMyEducations(myData.educations)
            setMyWorkExperiences(myData.workExperiences)
            setMyCertificates(myData.certificates)
            setMyReferences(myData.references)
            setMyLanguages(myData.languages)
            setMyInterests(myData.interests)

            document.getElementById("content").style.display = "block";
            document.getElementById("content-loading").style.display = "none";

        })
        .catch(err => {
            console.log(err);
            document.getElementById("content-loading").style.display = "none";
            document.getElementById("error").style.display = "flex";
        })  
}

function tryagain(){
    document.location.reload();
}

function setMyInformation(person){
   document.getElementById("profileImg").src = person.profileImg;
   document.getElementById("name").innerText = person.name;
   document.getElementById("surname").innerText = person.surname;
   document.getElementById("profession").innerText = person.profession;
   document.getElementById("address").innerText = person.address;
   document.getElementById("email").innerText = person.email;
   document.getElementById("phone").innerText = person.phone;
   document.getElementById("myProfile").innerHTML = person.myProfile;
   console.log(person); 

   document.getElementById("input-name").value = person.name;
   document.getElementById("input-surname").value = person.surname;
   document.getElementById("input-profession").value = person.profession;
   document.getElementById("input-address").value = person.address;
   document.getElementById("input-email").value = person.email;
   document.getElementById("input-phone").value = person.phone;
   document.getElementById("input-profile").value = person.myProfile;
}

function keyupInputandSetValue(id, event){
    document.getElementById(id).innerText = event.target.value;
}

function setMySocialMedias(socialMedias){
    let text = "";
    for(let socialMedia of socialMedias){
        text += `
        <a href="${socialMedia.link}" target="_blank" class="social_link">
            <i class='${socialMedia.icon}'></i> ${socialMedia.name}
        </a>`
    }

    console.log(socialMedias);
    document.getElementById("mySocialMedias").innerHTML = text;
}

function setMyEducations(educations){
    let text = "";
    for(let education of educations){
        text += `
        <div class="education_content">
            <div class="education_time">
                <span class="education_rounder"></span>
                <span class="education_line"></span>
            </div>
            <div class="education_data bd-grid">
                <h3 class="education_title">${education.title}</h3>
                <span class="education_studies">${education.studies}</span>
                <span class="education_year">${education.year}</span>
            </div>
        </div>`
    }

    console.log(educations);
    document.getElementById("myEducation").innerHTML = text;
    
}

function setMySkills(skills){
    let text = "";
        for(let skill of skills){
            text += `
            <li class="skills_name">
                <span class="skills_circle"></span> ${skill.title}
            </li>`
        }

        console.log(skills);
        document.getElementById("mySkills").innerHTML = text;        
}

function setMyWorkExperiences(workExperiences){
    let text = "";
    for(let workExperience of workExperiences){
        text += ` 
        <div class="experience_content">
        <div class="experience_time">
            <span class="experience_rounder"></span>
            <span class="experience_line"></span>
        </div>
        <div class="experience_data bd-grid">
            <h3 class="experience_title">${workExperience.title}</h3>
            <span class="experience_company">${workExperience.yearSubtitle}</span>
            <p class="experience_description">${workExperience.description}</p>
        </div>  
    </div>`
    }

    console.log(workExperiences);
    document.getElementById("myExperiences").innerHTML = text;
}

function setMyCertificates(certificates){
    let text = "";
    for(let certificate of certificates){
        text += `
        <div class="certificate_content">
            <h3 class="cerficate_title">${certificate.title}</h3>
            <p class="certificate_description">${certificate.description}</p>
        </div>`                  
    }

    console.log(certificates);
    document.getElementById("myCertificates").innerHTML = text;
}

function setMyReferences(references){
    let text = "";
    for(let reference of references){
        text += `
        <div class="references_content bd-grid">
            <span class="references_subtitle">${reference.subtitle}</span>
            <h3 class="references_title">${reference.title}</h3>
            <ul class="references_contact">
                <li>Phone: ${reference.phone}</li>
                <li>Email: ${reference.email}</li>
            </ul>
        </div>`
    }

    console.log(references);
    document.getElementById("myReferences").innerHTML = text;
}

function setMyLanguages(languages){
    let text = "";
    for(let language of languages){
        text += `
        <li class="languages_name">
            <span class="languages_circle"></span> ${language.name}
        </li>`
    }

    document.getElementById("myLanguages").innerHTML = text;
}

function setMyInterests(interests){
    let text = "";
    for(let interest of interests){
        text += `
        <div class="interests_content">
            <i class='${interest.icon}'></i>
            <span class="interests_name">${interest.name}</span>
        </div>`
    }

    document.getElementById("myInterests").innerHTML = text;
}
