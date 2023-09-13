/*=============== REDUCE THE SIZE AND PRINT ON AN A4 SHEET ===============*/ 
/* REDUCE THE SIZE AND PRINT ON AN A4 SHEET */ 
function scaleCv(){
    document.body.classList.add('scale-cv');
}

/*REMOVE THE SIZE WHEN THE CV IS DOWNLOADED */
function removeScale(){
    document.body.classList.remove('scale-cv');
} 

/* GENERATE PDF */ 
// PDF generated 
let areaCv = document.getElementById('area-cv')
let resumeButton = document.getElementById('resume-button');

// Html2pdf options
let opt = {
    margin:       0,
    filename:     'myResume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 4 },
    jsPDF:        { format: 'a4', orientation: 'portrait' }
  };

// Function to call areaCv and Html2Pdf options 
function generateResume(){
    html2pdf(areaCv, opt);
}

// When the button is clicked, it executes the three functions
resumeButton.addEventListener('click', () =>{
    // 1. The class .scale-cv is added to the body, where it reduces the size of the elements
    scaleCv();

    // 2. The PDF is generated
    generateResume();

    // 3. The .scale-cv class is removed from the body after 3 seconds to return to normal size.
    setTimeout(removeScale, 3000);
})

/* --- Information from the API is received --- */
get();

//orijinal değerler saklanacak
let myData = {}

function get(){
    document.getElementById("content").style.display = "none";
    document.getElementById("content-loading").style.display = "block";
    document.getElementById("error").style.display = "none";
    axios.get("http://localhost:5500/api/get")
        .then(res => {
            myData = res.data;
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
    document.getElementById(id).innerHTML = event.target.value;
    myData.person[id] = event.target.value; //değişkenlerde artık apiden değil kullanıcan alınan değerler var.
}

function showEditForm(){
    const content = document.getElementById("content");
    content.classList.add("main");

    const editForm = document.getElementById("edit-form");
    editForm.style.display = "block";

    document.getElementById("button-edit").style.display = "none";
    document.getElementById("resume-button").style.display = "none";
}

function hideEditForm(){
    const result = confirm("Are you sure cancel this changing?")
    if(!result) return;

    clear()
}

function clear(){
    const content = document.getElementById("content");
    content.classList.remove("main");

    const editForm = document.getElementById("edit-form");
    editForm.style.display = "none";

    document.getElementById("button-edit").style.display = "block";
    document.getElementById("resume-button").style.display = "block";

    //yapılan değişikle iptal edilsin
    get();
}

function save(){
    axios.post("http://localhost:5500/api/set",myData)
    .then(res => {
        clear(); //api isteğini tekrar yaparak değiştirilmiş verileri getirir
    })
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

function createSkilElementForShowField(skills){
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

function setMySkills(skills){  
    createSkilElementForShowField(skills);

    //index silinen kısma başka bir veri atarak indeksi yine doldurduğu için kaymaoluyor bu üzden id ile çalıştık.
    let editText = "";
    let id = 0;
        for(let skill of skills){ 
            id++;
            editText += `
            <li id="skillEditDiv${id}" data-id="${skill.id}" class="skills_name">
                <span class="skills_circle"></span>
                    <span>
                        <label for="input-skillTitle"></label>
                        <input type="text" id="input-skillTitle" value="${skill.title}"  style="width: 150px;"><br>
                        <button onclick="removeSkillForEditForm('skillEditDiv${id}')">Delete</button>
                    </span>
            </li>`
        }
    
    document.getElementById("ul-skills").innerHTML = editText;
}

function removeSkillForEditForm(elementId){
    //debugger
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    //id'ye göre arıyarak indeksini bul.
    const index = myData.skills.findIndex(p => p.id == id);
    
    //elementin kaydını siler
    myData.skills.splice(index,1);

    //edit formdan siler
    element.remove();

    createSkilElementForShowField(myData.skills);
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
