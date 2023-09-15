/* REDUCE THE SIZE AND PRINT ON AN A4 SHEET */
function scaleCv() {
    document.body.classList.add('scale-cv');
}

/*REMOVE THE SIZE WHEN THE CV IS DOWNLOADED */
function removeScale() {
    document.body.classList.remove('scale-cv');
}

/* GENERATE PDF */
// PDF generated 
let areaCv = document.getElementById('area-cv')
let resumeButton = document.getElementById('resume-button');

// Html2pdf options
let opt = {
    margin: 0,
    filename: 'myResume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { format: 'a4', orientation: 'portrait' }
};

// Function to call areaCv and Html2Pdf options 
function generateResume() {
    html2pdf(areaCv, opt);
}

// When the button is clicked, it executes the three functions
resumeButton.addEventListener('click', () => {
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

function get() {
    document.getElementById("content").style.display = "none";
    document.getElementById("content-loading").style.display = "block";
    document.getElementById("error").style.display = "none";
    axios.get("http://localhost:5000/api/get")
        .then(res => {
            myData = res.data; //tüm veriler myData içinde saklı
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

function tryagain() {
    document.location.reload();
}

function setMyInformation(person) {
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

function keyupInputandSetValue(id, event) { //person yerine objName eklene(cek)bilir
    document.getElementById(id).innerHTML = event.target.value;
    myData.person[id] = event.target.value; //index.js person değişkenlerinde artık apiden değil kullanıcan alınan değerler var.
}

function showEditForm() {
    const content = document.getElementById("content");
    content.classList.add("main");

    const editForm = document.getElementById("edit-form");
    editForm.style.display = "block";

    document.getElementById("button-edit").style.display = "none";
    document.getElementById("resume-button").style.display = "none";
}

function hideEditForm() {
    const result = confirm("Are you sure cancel this changing?")
    if (!result) return;

    clear()
}

function clear() {
    const content = document.getElementById("content");
    content.classList.remove("main");

    const editForm = document.getElementById("edit-form");
    editForm.style.display = "none";

    document.getElementById("button-edit").style.display = "block";
    document.getElementById("resume-button").style.display = "block";

    //api isteğini tekrar yapar
    get();
}

//myData, içindeki verileri sunucuya iletmek için kullanılır
function save() {
    axios.post("http://localhost:5000/api/set", myData)
        .then(res => {
            clear();
        })
}

//yeni eklenen ögeleri content sayfasına yansıtmak için - *tüm yapıda kullanılabilir*
function keyupGetAndSetInputValue(event, name, objectName) {
    const element = event.target;
    const id = element.dataset["id"];
    const index = myData[objectName].findIndex(p => p.id == id || p._id == id);

    myData[objectName][index][name] = element.value;
}

//* --- ******************** SOCIAL MEDIAS ********************---*/
function createSocialMediaElementForShowField(socialMedias){
    let text = "";
    for (let socialMedia of socialMedias) {
        text += `
        <a href="${socialMedia.link}" target="_blank" class="social_link">
            <i class='${socialMedia.icon}'></i> ${socialMedia.name}
        </a>`
    }

    console.log(socialMedias);
    document.getElementById("mySocialMedias").innerHTML = text;
}

let socialMediaEditId = 0;

function setMySocialMedias(socialMedias) {
    createSocialMediaElementForShowField(socialMedias)

    let editText = "";
        for(let socialMedia of socialMedias){
            socialMediaEditId++;
            editText += getSocialMediaEditFormDivField(socialMedia)
        }
    
    document.getElementById("socialmedia-div").innerHTML = editText;
}

function getSocialMediaEditFormDivField(socialMedia){
    if(socialMedia._id === null){
        return `
        <span id="socialMediaEditDiv${socialMediaEditId}" data-id="${socialMedia.id}">
            <i class='${socialMedia.icon}'></i>

            <label for=""input-socialMedias${socialMediaEditId}">:</label>
            <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'socialMedias'), createSocialMediaElementForShowField(myData.socialMedias)" type="text" id="input-socialMedias${socialMediaEditId}" data-id="${socialMedia.id}" value="${socialMedia.name}" style="width: 150px;"><br>
            <button class="button-delete" onclick="removeSocialMediaForEditForm('socialMediaEditDiv${socialMediaEditId}')">Delete</button>
        </span>`
    }
    else{
        return `
        <span id="socialMediaEditDiv${socialMediaEditId}" data-id="${socialMedia._id}">
        <i class='${socialMedia.icon}'></i>

        <label for=""input-socialMedias${socialMediaEditId}">:</label>
        <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'socialMedias'), createSocialMediaElementForShowField(myData.socialMedias)" type="text" id="input-socialMedias${socialMediaEditId}" data-id="${socialMedia._id}" value="${socialMedia.name}" style="width: 150px;"><br>
        <button class="button-delete" onclick="removeSocialMediaForEditForm('socialMediaEditDiv${socialMediaEditId}')">Delete</button>
    </span>`
    }
    
}

function createEducationEditFormDivField() {
    socialMediaEditId++;
    const socialMedia = {_id:null, id: socialMediaEditId, name: ""}; //database de değişiklik yapılacak
    myData.socialMedias.push(socialMedia);
    document.getElementById("socialmedia-div").innerHTML += getSocialMediaEditFormDivField(socialMedia);

    createSocialMediaElementForShowField(myData.socialMedias) //content sayfasına da ekler.
}

function removeSocialMediaForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.socialMedias.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.socialMedias.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createSocialMediaElementForShowField(myData.socialMedias)
}

//* --- ******************** EDUCATIONS ********************---*/
function createEducationElementForShowField(educations) {
    let text = "";
    for (let education of educations) {
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

let educationEditId = 0;

function setMyEducations(educations) {
    createEducationElementForShowField(educations);

    //normal formda kaç veri varsa o kadar input gelsin
    let editText = "";
    for (let education of educations) {
        educationEditId++;
        editText += getEducationEditFormDivField(education);

        document.getElementById("education-div").innerHTML = editText;
    }

}

function getEducationEditFormDivField(education){
    if(education._id === null){
        return `
    <div id="educationEditDiv${educationEditId}" data-id="${education.id}" class="education_content">
        <div class="education_time">
            <span class="education_rounder"></span>
            <span class="education_line"></span>
        </div>

        <div class="education_data bd-grid">
            <span>
                <label for="input-depertmant">Depertmant:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-depertmant${educationEditId}" data-id="${education.id}" value="${education.title}" style="width: 175px;"><br>
            </span>
            <span>
                <label for="input-univercity">Univercity:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'studies', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-Univercity${educationEditId}" data-id="${education.id}" value="${education.studies}" style="width: 175px;"><br>
            </span>
            <span>
                <label for="input-year">Education Year:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'year', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-year${educationEditId}" data-id="${education.id}" value="${education.year}" style="width: 175px;"><br>
            </span>
            <button class="button-delete" onclick="removeEducationForEditForm('educationEditDiv${educationEditId}')">Delete</button>
        </div>
    </div>`
    }
    else{
        return `
        <div id="educationEditDiv${educationEditId}" data-id="${education._id}" class="education_content">
            <div class="education_time">
                <span class="education_rounder"></span>
                <span class="education_line"></span>
            </div>
    
            <div class="education_data bd-grid">
                <span>
                    <label for="input-depertmant">Depertmant:</label>
                    <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-depertmant${educationEditId}" data-id="${education._id}" value="${education.title}" style="width: 175px;"><br>
                </span>
                <span>
                    <label for="input-univercity">Univercity:</label>
                    <input onkeyup="keyupGetAndSetInputValue(event, 'studies', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-Univercity${educationEditId}" data-id="${education._id}" value="${education.studies}" style="width: 175px;"><br>
                </span>
                <span>
                    <label for="input-year">Education Year:</label>
                    <input onkeyup="keyupGetAndSetInputValue(event, 'year', 'educations'), createEducationElementForShowField(myData.educations)" type="text" id="input-year${educationEditId}" data-id="${education._id}" value="${education.year}" style="width: 175px;"><br>
                </span>
                <button class="button-delete" onclick="removeEducationForEditForm('educationEditDiv${educationEditId}')">Delete</button>
            </div>
        </div>`
    }
    
}

function createEducationEditFormDivField() {
    educationEditId++;
    const education = {_id:null, id: educationEditId, title: "", studies:"", year:""}; //database de değişiklik yapılacak
    myData.educations.push(education);
    document.getElementById("education-div").innerHTML += getEducationEditFormDivField(education);

    createEducationElementForShowField(myData.educations) //content sayfasına da ekler.
}

//elementi ve myDatada ki kaydı siler. 
function removeEducationForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.educations.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.educations.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createEducationElementForShowField(myData.educations)
}

//* --- ******************** SKILLS ********************---*/
function createSkilElementForShowField(skills) {
    let text = "";
    for (let skill of skills) {
        text += `
        <li class="skills_name">
            <span class="skills_circle"></span> ${skill.title}
        </li>`
    }

    console.log(skills);
    document.getElementById("mySkills").innerHTML = text;
}

let skillEditId = 0;

function setMySkills(skills) {
    createSkilElementForShowField(skills);

    //index silinen kısma başka bir veri atarak indeksi yine doldurduğu için kaymaoluyor bu üzden id ile çalıştık.
    let editText = "";
    for (let skill of skills) {
        skillEditId++;
        editText += getSkillEditFormLiField(skill);
    }

    document.getElementById("ul-skills").innerHTML = editText;
}

function getSkillEditFormLiField(skill) {
    if(skill._id === null){
        return `
        <li id="skillEditDiv${skillEditId}" data-id="${skill.id}" class="skills_name">
        <span class="skills_circle"></span>
            <span>
                <label for="input-skillTitle"></label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'skills'), createSkilElementForShowField(myData.skills)" type="text" id="input-skillTitle${skillEditId}" data-id="${skill.id}" value="${skill.title}" style="width: 150px;"><br>
                <button class="button-delete" onclick="removeSkillForEditForm('skillEditDiv${skillEditId}')">Delete</button>
            </span>
        </li>`
    }
    else
    {
    return`
        <li id="skillEditDiv${skillEditId}" data-id="${skill._id}" class="skills_name">
            <span class="skills_circle"></span>
                <span>
                    <label for="input-skillTitle"></label>
                    <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'skills'), createSkilElementForShowField(myData.skills)" type="text" id="input-skillTitle${skillEditId}" data-id="${skill._id}" value="${skill.title}" style="width: 150px;"><br>
                    <button class="button-delete" onclick="removeSkillForEditForm('skillEditDiv${skillEditId}')">Delete</button>
                </span>
        </li>`
    }
}

//!_id:null,
function createSkillEditFormLiField() {
    skillEditId++;
    const skill = {_id:null, id: skillEditId, title: "" }; //database için _id:null eklendi
    
    myData.skills.push(skill);
    document.getElementById("ul-skills").innerHTML += getSkillEditFormLiField(skill);

    createSkilElementForShowField(myData.skills) //content sayfasına da ekler.
}

function removeSkillForEditForm(elementId) {
    //debugger
    const element = document.getElementById(elementId);
    if(element === undefined) return;

    const id = element.dataset["id"]; //data-id den alndı.
    //id'ye göre arıyarak indeksini bul.
    const index = myData.skills.findIndex(p => p.id == id || p._id == id);

    //elementin kaydını siler
    myData.skills.splice(index, 1);

    //edit formdan siler
    element.remove();

    createSkilElementForShowField(myData.skills);
}

//* --- ******************** WORK EXPERIENCES ********************---*/

function createWorkExperienceElementForShowField(workExperiences) {
    let text = "";
    for (let workExperience of workExperiences) {
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

let workExperienceEditId = 0;

function setMyWorkExperiences(workExperiences) {
    createWorkExperienceElementForShowField(workExperiences)

    let editText = "";
    for (let workExperience of workExperiences) {
        workExperienceEditId++;
        editText += getWorkExperienceEditFormDivField(workExperience);

        document.getElementById("experience-div").innerHTML = editText;
    }
}

function getWorkExperienceEditFormDivField(workExperience){
    if(workExperience._id === null){
        return `
        <div id="workExperienceEditDiv${workExperienceEditId}" data-id="${workExperience.id}" class="experience_content">
        <div class="experience_time">
            <span class="experience_rounder"></span>
            <span class="experience_line"></span>
        </div>
    
        <div class="experience_data bd-grid">
                <label for="input-experience">Experience:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" type="text" id="input-experience${workExperienceEditId}" data-id="${workExperience.id}" value="${workExperience.title}" style="width: 250px;">
                <label for="input-year-departmant">Year and Depertmant:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'yearSubtitle', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" type="text" id="input-year-departmant${workExperienceEditId}" data-id="${workExperience.id}" value="${workExperience.yearSubtitle}" style="width: 250px;">
                <label for="input-description">Description:</label>
                <textarea onkeyup="keyupGetAndSetInputValue(event, 'description', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" id="input-description${workExperienceEditId}" data-id="${workExperience.id}" rows="7" cols="38">${workExperience.description}</textarea>
                <button class="button-delete" onclick="removeWorkExperienceForEditForm('workExperienceEditDiv${workExperienceEditId}')">Delete</button>
        </div>  
    </div>`
    }
    else{
        return `
        <div id="workExperienceEditDiv${workExperienceEditId}" data-id="${workExperience._id}" class="experience_content">
        <div class="experience_time">
            <span class="experience_rounder"></span>
            <span class="experience_line"></span>
        </div>
    
        <div class="experience_data bd-grid">
                <label for="input-experience">Experience:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" type="text" id="input-experience${workExperienceEditId}" data-id="${workExperience._id}" value="${workExperience.title}" style="width: 250px;">
                <label for="input-year-departmant">Year and Depertmant:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'yearSubtitle', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" type="text" id="input-year-departmant${workExperienceEditId}" data-id="${workExperience._id}" value="${workExperience.yearSubtitle}" style="width: 250px;">
                <label for="input-description">Description:</label>
                <textarea onkeyup="keyupGetAndSetInputValue(event, 'description', 'workExperiences'), createWorkExperienceElementForShowField(myData.workExperiences)" id="input-description${workExperienceEditId}" data-id="${workExperience._id}" rows="7" cols="38">${workExperience.description}</textarea>
                <button class="button-delete" onclick="removeWorkExperienceForEditForm('workExperienceEditDiv${workExperienceEditId}')">Delete</button>
        </div>  
    </div>`
    }
}

function createWorkExperienceEditFormDivField() {
    workExperienceEditId++;
    const workExperience = {_id:null, id: workExperienceEditId, title: "", yearSubtitle: "", description: ""}; //database de değişiklik yapılacak
    myData.workExperiences.push(workExperience);
    document.getElementById("experience-div").innerHTML += getWorkExperienceEditFormDivField(workExperience);

    createWorkExperienceElementForShowField(myData.workExperiences) //content sayfasına da ekler.
}

function removeWorkExperienceForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.workExperiences.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.workExperiences.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createWorkExperienceElementForShowField(myData.workExperiences)
}

//* --- ******************** CERTIFICATES ******************** ---*/

function createCertificatesElementForShowField(certificates) {
    let text = "";
    for (let certificate of certificates) {
        text += `
        <div class="certificate_content">
            <h3 class="cerficate_title">${certificate.title}</h3>
            <p class="certificate_description">${certificate.description}</p>
        </div>`
    }

    console.log(certificates);
    document.getElementById("myCertificates").innerHTML = text;
}

let certificateEditId = 0;

function setMyCertificates(certificates) {
    createCertificatesElementForShowField(certificates)

    let editText = "";
    for (let certificate of certificates) {
        certificateEditId++;
        editText += getCertificateEditFormDivField(certificate);
    }

    document.getElementById("certificate-div").innerHTML = editText;
}

function getCertificateEditFormDivField(certificate){
    if(certificate._id === null){
        return `
    <div id="certificateEditDiv${certificateEditId}" data-id="${certificate.id}" class="certificate_content">
            <label for="input-certificate">Certificate:</label><br>
            <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'certificates'), createCertificatesElementForShowField(myData.certificates)" type="text" id="input-certificate${certificateEditId}" data-id="${certificate.id}" value="${certificate.title}" style="width: 250px;"><br>

            <label for="input-certificate_description">Description:</label><br>
            <textarea onkeyup="keyupGetAndSetInputValue(event, 'description', 'certificates'), createCertificatesElementForShowField(myData.certificates)"  id="input-certificate_description${certificateEditId}" data-id="${certificate.id}" rows="6" cols="40">${certificate.description}</textarea><br>

            <button class="button-delete" onclick="removeCertificateForEditForm('certificateEditDiv${certificateEditId}')">Delete</button>
    </div>`
    }
    else{
        return `
    <div id="certificateEditDiv${certificateEditId}" data-id="${certificate._id}" class="certificate_content">
            <label for="input-certificate">Certificate:</label><br>
            <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'certificates'), createCertificatesElementForShowField(myData.certificates)" type="text" id="input-certificate${certificateEditId}" data-id="${certificate._id}" value="${certificate.title}" style="width: 250px;"><br>

            <label for="input-certificate_description">Description:</label><br>
            <textarea onkeyup="keyupGetAndSetInputValue(event, 'description', 'certificates'), createCertificatesElementForShowField(myData.certificates)"  id="input-certificate_description${certificateEditId}" data-id="${certificate._id}" rows="6" cols="40">${certificate.description}</textarea><br>

            <button class="button-delete" onclick="removeCertificateForEditForm('certificateEditDiv${certificateEditId}')">Delete</button>
    </div>`
    }
    
}

function createCertificateEditFormDivField() {
    certificateEditId++;
    const certificate = {_id:null, id: certificateEditId, title: "",  description: ""}; //database de değişiklik yapılacak
    myData.certificates.push(certificate);
    document.getElementById("certificate-div").innerHTML += getCertificateEditFormDivField(certificate);

    createCertificatesElementForShowField(myData.certificates) //content sayfasına da ekler.
}

function removeCertificateForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.certificates.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.certificates.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createCertificatesElementForShowField(myData.certificates)
}

//* --- ******************** REFERENCES ********************---*/
function createReferencesElementForShowField(references) {
    let text = "";
    for (let reference of references) {
        text += `
        <div class="references_content bd-grid">
            <span class="references_subtitle">${reference.subtitle}</span>
            <h3 class="references_title">${reference.title}</h3>
            <ul class="references_contact">
                <li>${reference.phone}</li>
                <li>${reference.email}</li>
            </ul>
        </div>`
    }

    console.log(references);
    document.getElementById("myReferences").innerHTML = text;
}

let referenceEditId = 0;

function setMyReferences(references) {
    createReferencesElementForShowField(references)

    let editText = "";
    for (let reference of references) {
        referenceEditId++;
        editText += getReferenceEditFormDivField(reference);
    }
    document.getElementById("reference-div").innerHTML = editText;
}

function getReferenceEditFormDivField(reference){
    if(reference._id === null){
        return `
    <div id="referenceEditDiv${referenceEditId}" data-id="${reference.id}" class="references_content bd-grid">
            <span>
                <label for="input-references_subtitle">Reference Subtitle:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'subtitle', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_subtitle${referenceEditId}" data-id="${reference.id}" value="${reference.subtitle}"><br>
            </span>
            <span>
                <label for="input-references_title">References Title:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_title${referenceEditId}" data-id="${reference.id}" value="${reference.title}"><br>
            </span>
            <span>
                <label for="input-references_phone">Phone:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'phone', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_phone${referenceEditId}" data-id="${reference.id}" value="${reference.phone}"><br>
            </span>  
            <span>
                <label for="input-references_email">Email:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'email', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_email${referenceEditId}" data-id="${reference.id}" value="${reference.email}"><br>
                <button class="button-delete" onclick="removeReferencesForEditForm('referenceEditDiv${referenceEditId}')">Delete</button>
            </span>
    </div>`
    }
    else{
        return `
    <div id="referenceEditDiv${referenceEditId}" data-id="${reference._id}" class="references_content bd-grid">
            <span>
                <label for="input-references_subtitle">Reference Subtitle:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'subtitle', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_subtitle${referenceEditId}" data-id="${reference._id}" value="${reference.subtitle}"><br>
            </span>
            <span>
                <label for="input-references_title">References Title:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'title', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_title${referenceEditId}" data-id="${reference._id}" value="${reference.title}"><br>
            </span>
            <span>
                <label for="input-references_phone">Phone:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'phone', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_phone${referenceEditId}" data-id="${reference._id}" value="${reference.phone}"><br>
            </span>  
            <span>
                <label for="input-references_email">Email:</label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'email', 'references'), createReferencesElementForShowField(myData.references)" type="text" id="input-references_email${referenceEditId}" data-id="${reference._id}" value="${reference.email}"><br>
                <button class="button-delete" onclick="removeReferencesForEditForm('referenceEditDiv${referenceEditId}')">Delete</button>
            </span>
    </div>`
    }
    
}

function removeReferencesForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.references.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.references.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createReferencesElementForShowField(myData.references)
}

//* --- ******************** LANGUAGES ********************---*/

function createLanguageElementForShowField(languages){
    let text = "";
    for (let language of languages) {
        text += `
        <li class="languages_name">
            <span class="languages_circle"></span> ${language.name}
        </li>`
    }

    document.getElementById("myLanguages").innerHTML = text;
}

let languageEditId = 0;

function setMyLanguages(languages) {
    createLanguageElementForShowField(languages)

    editText = "";
    for(let language of languages){
        languageEditId++;
        editText += getLanguageEditFormUlField(language);
    }

    document.getElementById("ul-languages").innerHTML = editText;
}

function getLanguageEditFormUlField(language){
    if(language._id === null){
        return ` 
        <ul id="languageEditDiv${languageEditId}" data-id="${language.id}" class="languages_content bd-grid">
            <li class="languages_name">
                <span class="languages_circle"></span>
                <span>
                <label for="input-languages"></label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'languages'), createLanguageElementForShowField(myData.languages)" type="text" id="input-languages${languageEditId}" data-id="${language.id}" value=${language.name}><br>
                <button class="button-delete" onclick="removeLanguageForEditForm('languageEditDiv${languageEditId}')">Delete</button>
                </span>
            </li>
        </ul>`
    }
    else{
        return ` 
        <ul id="languageEditDiv${languageEditId}" data-id="${language._id}" class="languages_content bd-grid">
            <li class="languages_name">
                <span class="languages_circle"></span>
                <span>
                <label for="input-languages"></label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'languages'), createLanguageElementForShowField(myData.languages)" type="text" id="input-languages${languageEditId}" data-id="${language._id}" value=${language.name}><br>
                <button class="button-delete" onclick="removeLanguageForEditForm('languageEditDiv${languageEditId}')">Delete</button>
                </span>
            </li>
        </ul>`
    }
    
}

function createLanguageEditFormDivField() {
    languageEditId++;
    const language = {_id:null, id: languageEditId, name: ""}; //database de değişiklik yapılacak
    myData.languages.push(language);
    document.getElementById("ul-languages").innerHTML += getLanguageEditFormUlField(language);

    createLanguageElementForShowField(myData.languages) //content sayfasına da ekler.
}

function removeLanguageForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.languages.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.languages.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createLanguageElementForShowField(myData.languages)
}

//* --- ******************** INTERESTS ********************---*/

function createInterestElementForShowField(interests){
    let text = "";
    for (let interest of interests) {
        text += `
        <div class="interests_content">
            <i class='${interest.icon}'></i>
            <span class="interests_name">${interest.name}</span>
        </div>`
    }

    document.getElementById("myInterests").innerHTML = text;
}

let interestEditId = 0;

function setMyInterests(interests) {
    createInterestElementForShowField(interests)

    let editText = "";
        for(let interest of interests){
            interestEditId++;
            editText += getInterestEditFormDivField(interest);
        }

    document.getElementById("interest-div").innerHTML = editText;
}

function getInterestEditFormDivField(interest){
    if(interest._id === null){
        return `
        <div id="interestEditDiv${interestEditId}" data-id="${interest.id}" class="edit-interests_content">
            <span>
                <label for="input-interests_name"></label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'interests'), createInterestElementForShowField(myData.interests)" type="text" id="input-interests_name${interestEditId}" data-id="${interest.id}" value="${interest.name}"><br>
                <button class="button-delete" onclick="removeInterestForEditForm('interestEditDiv${interestEditId}')">Delete</button>
            </span>
        </div>`
    }
    else{
        return `
        <div id="interestEditDiv${interestEditId}" data-id="${interest._id}" class="edit-interests_content">
            <span>
                <label for="input-interests_name"></label>
                <input onkeyup="keyupGetAndSetInputValue(event, 'name', 'interests'), createInterestElementForShowField(myData.interests)" type="text" id="input-interests_name${interestEditId}" data-id="${interest._id}" value="${interest.name}"><br>
                <button class="button-delete" onclick="removeInterestForEditForm('interestEditDiv${interestEditId}')">Delete</button>
            </span>
        </div>`
    }
   
}

function createInterestEditFormDivField() {
    interestEditId++;
    const interest = {_id:null, id: interestEditId, name: ""}; //database de değişiklik yapılacak
    myData.interests.push(interest);
    document.getElementById("interest-div").innerHTML += getInterestEditFormDivField(interest);

    createInterestElementForShowField(myData.interests) //content sayfasına da ekler.
}

function removeInterestForEditForm(elementId) {
    const element = document.getElementById(elementId);
    const id = element.dataset["id"];
    const index = myData.interests.findIndex(p => p.id == id || p._id == id);//direkt id'ye göre silemediği için index bulunur
    myData.interests.splice(index, 1); //serverdaki kaydı siler
    element.remove(); //editformdan siler.

    //silinen öge, content formun yenilenmesi ile myDatadaki yeni kayıtları getirerek contentformda da silinmiş olur
    createInterestElementForShowField(myData.interests)
}