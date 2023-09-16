const express = require("express");
const app = express();

const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

//export edildi. (paylaşıma açıldı)
const Personal = require("./models/personal");
const SocialMedia = require("./models/socialmedia");
const Education = require("./models/education");
const Skill = require("./models/skill");
const WorkExperience = require("./models/workexperience");
const Certificate = require("./models/certificate");
const Reference = require("./models/reference");
const Language = require("./models/language");
const Interest = require("./models/interest");

const connect = require("./connection");
connect(); //express gibi method olarak çağrıldı.

app.use(cors());
app.use(express.json());

let person = {
    profileImg: "profileImg.jpg",
    name: "Gaye",
    surname: "TEKIN",
    profession: "Computer Engineer - Full Stack .Net Developer",
    address: "Ankara, Turkiye",
    email: "gayemce4@gmail.com",
    phone: "+90 541 602 2536",
    myProfile: `<p class="profile_description">I graduated from Kastamonu University in July 2022 as an honor student with an average of 3.02. I work in C#, T-SQL, Html, Css, JavaScript and Web API Technologies.</p>`
}

let socialMedias = [
    {
        name: "@gayemce",
        link: "https://www.linkedin.com/in/gayemce/",
        icon: "bx bxl-linkedin-square social_icon"
    },
    {
        name: "@gayemce",
        link: "https://github.com/gayemce",
        icon: "bx bxl-github social_icon"
    },
    {
        name: "@gayemce",
        link: "https://medium.com/@gayemce",
        icon: "bx bxl-medium social_icon"
    }
]

let educations = [
    {
        title: "COMPUTER ENGINEERING",
        studies: "Kastamonu University",
        year: "2018-2022"
    }   
]

let skills = [
    {
        title: "C#"
    },
    {
        title: "CSS"
    },
    {
        title: "HTML"
    },
    {
        title: "Javascript"
    }
]

let workExperiences = [ 
    {
        title: "Eti Bakır A.Ş",
        yearSubtitle: "2022 | Intern Computer Engineer",
        description: "I gained experience in hardware installations and IP/TCP. I personally performed hardware installations for the company, IP telephony usage and the necessary IP assignments."
    },
    {
        title: "Betelgeuse Rocket Team | Teknofest",
        yearSubtitle: "2020 -2021 | Avionic Systems Software Team Captain",
        description: "I was a founding member of the Betelgeuse Rocket team, which was established in September 2020 under the leadership of Kastamonu University Robotics Club, consisting of engineering students, and participated in the Teknofest Rocket competition."
    }
]

let certificates = [
    {
        title: "Programing 101: HTML",
        description: "101: HTML training program on January 22, 2023 and I was awarded this certificate."
    },
    {
        title: "Programing 201: HTML5 & CSS",
        description: "201: HTML5 & CSS training program on January 22, 2023 and I was awarded this certificate."
    }
]

let references = [
    {
        subtitle: "Software Trainer",
        title: "Taner Saydam",
        phone: "0541 541 5411",
        email: "user@gmail.com"
    }
]

let languages = [
    {
        name: "Turkish"
    },
    {
        name: "English"
    }
]

let interests = [
    {
        icon: "bx bx-headphone interests_icon",
        name: "Music"
    },
    {
        icon: "bx bx-book-heart interests_icon",
        name: "Read"
    }
]

//Mongodb'ye default verileri set eder.
app.get("/api/createDefaultValue", async (req, res)=> {
    let PersonalModel = await Personal.findOne();
    if(PersonalModel === null){
        PersonalModel = new Personal(person) //default verileri mongodb'ye atar.
        PersonalModel._id = uuidv4();
        await PersonalModel.save();
    }

    for(let s of socialMedias){
        let socialMedia = await SocialMedia.findOne({name: s.name, link: s.link});
        if(socialMedia === null){
            socialMedia = new SocialMedia(s);
            socialMedia.id = uuidv4();
            await socialMedia.save();
        }
    }

    for(let e of educations){
        let education = await Education.findOne({title: e.title});
        if(education === null){
            education = new Education(e);
            education.id = uuidv4();
            await education.save();
        }
    }

    //kontrol ederek eklenmeyenleri set eder.
    for(let s of skills){
        let skill = await Skill.findOne({title: s.title});
        if(skill === null){
            skill = new Skill(s);
            skill._id = uuidv4();
            await skill.save();
        }
    }

    for(let w of workExperiences){
        let workExperience = await WorkExperience.findOne({title: w.title, yearSubtitle: w.yearSubtitle});
        if(workExperience === null){
            workExperience = new WorkExperience(w);
            workExperience.id = uuidv4();
            await workExperience.save();
        }
    }

    for(let c of certificates){
        let certificate = await Certificate.findOne({title: c.title});
        if(certificate === null){
            certificate = new Certificate(c);
            certificate.id = uuidv4();
            await certificate.save();
        }
    }

    for(let r of references){
        let reference = await Reference.findOne({title: r.title});
        if(reference === null){
            reference = new Reference(r);
            reference.id = uuidv4();
            await reference.save();
        }
    }

    for(let l of languages){
        let language = await Language.findOne({name: l.name});
        if(language === null){
            language = new Language(l);
            language.id = uuidv4();
            await language.save();
        }
    }

    for(let i of interests){
        let interest = await Interest.findOne({name: i.name});
        if(interest === null){
            interest = new Interest(i);
            interest.id = uuidv4();
            await interest.save();
        }
    }

    res.json({message: "Create default value is succesful"});
})

app.get("", (req,res) => {
    res.json({message: "API is working"});
})

//Tüm veriler databaseden gelir.
app.get("/api/get", async (req,res) => {
    const myInformation = {
        person: await Personal.findOne(),
        skills: await Skill.find(),
        socialMedias: await SocialMedia.find(),
        educations: await Education.find(),
        workExperiences: await WorkExperience.find(),
        certificates: await Certificate.find(),
        references: await Reference.find(),
        languages: await Language.find(),
        interests: await Interest.find()
    }
    res.json(myInformation);
});

//Edit sayfasında değiştirilen veriler servera, sonra da database gönderilir ve kullanıcıya yansır.
app.post("/api/set", async(req,res) => {
    const body = req.body;
    // person = body.person; //*Person Update
    person = await Personal.findOne(); //kaydı bulur.
    const newPerson = new Personal(body.person); //güncelleme işlemini yapar.
    newPerson._id = person._id;
    await Personal.findByIdAndUpdate(person._id, newPerson); //Id'ye göre kaydı bulur ve günceller.

    /* ----- SocialMeadia - silme - güncelleme (ekleme pasif)----- */
    socialMedias = body.socialMedias;
    const currentSocialMedias = await SocialMedia.find();
    for(let s of currentSocialMedias){//databasede id listede aratılır yoksa content sayfasında silinir
        const result = socialMedias.findIndex(p=> p._id === s.id);
        if(result === -1){
            await SocialMedia.findByIdAndRemove(s._id);
        }
    }

    for(let s of socialMedias){
        if(s._id === null){
            const socialMedia = new SocialMedia();
            socialMedia._id = uuidv4();
            socialMedia.name = s.name;
            socialMedia.link = s.link;
            await socialMedia.save();
        }
        else{
            const socialMedia = new SocialMedia();
            socialMedia._id = s._id;
            socialMedia.name = s.name;
            socialMedia.link = s.link;
            await SocialMedia.findByIdAndUpdate(s._id, socialMedia);
        }   
    }

    /* ----- Education - silme - güncelleme - ekleme ----- */
    educations = body.educations;
    const educationSkills = await Education.find();
    for(let e of educationSkills){//databasede id listede aratılır yoksa content sayfasında silinir
        const result = educations.findIndex(p=> p._id === e.id);
        if(result === -1){
            await Education.findByIdAndRemove(e._id);
        }
    }

    for(let e of educations){
        if(e._id === null){
            const education = new Education();
            education._id = uuidv4();
            education.title = e.title;
            education.studies = e.studies;
            education.year = e.year;
            await education.save();
        }
        else{
            const education = new Education();
            education._id = e._id;
            education.title = e.title;
            education.studies = e.studies;
            education.year = e.year;
            await Education.findByIdAndUpdate(e._id, education);
        }
    }

     //*Silme
     skills = body.skills;
     const currentSkills = await Skill.find();
     for(let c of currentSkills){//databasede id listede aratılır yoksa content sayfasında silinir
         const result = skills.findIndex(p=> p._id === c.id);
         if(result === -1){
             await Skill.findByIdAndRemove(c._id);
         }
     }
 
     //*Ekleme, Güncelleme
     for(let s of skills){
         if(s._id === null){
             const skill = new Skill();
             skill._id = uuidv4();
             skill.title = s.title;
             await skill.save();
         }
         else{
             const skill = new Skill();
             skill._id = s._id;
             skill.title = s.title;
             await Skill.findByIdAndUpdate(s._id, skill);
         }
     }

    /* ----- WorkExperience - silme - güncelleme - ekleme ----- */
     workExperiences = body.workExperiences;
     const currentWorkExperience = await WorkExperience.find();
     for(let w of currentWorkExperience){
        const result = workExperiences.findIndex(p=> p._id === w.id);
        if(result === -1){
            await WorkExperience.findByIdAndRemove(w._id);
        }
     }

     for(let w of workExperiences){
        if(w._id === null){
            const workExperience = new WorkExperience();
            workExperience._id = uuidv4();
            workExperience.title = w.title;
            workExperience.yearSubtitle = w.yearSubtitle;
            workExperience.description = w.description;
            await workExperience.save();
        }
        else{
            const workExperience = new WorkExperience();
            workExperience._id = w._id;
            workExperience.title = w.title;
            workExperience.yearSubtitle = w.yearSubtitle;
            workExperience.description = w.description;
            await WorkExperience.findByIdAndUpdate(w._id, workExperience);
        }
    }

    /* ----- Certificate - silme - ekleme - güncelleme ----- */
    certificates = body.certificates;
    const currentCertificate = await Certificate.find();
     for(let c of currentCertificate){
        const result = certificates.findIndex(p=> p._id === c.id);
        if(result === -1){
            await Certificate.findByIdAndRemove(c._id);
        }
     }

     for(let c of certificates){
        if(c._id === null){
            const certificate = new Certificate();
            certificate._id = uuidv4();
            certificate.title = c.title;
            certificate.description = c.description;
            await certificate.save();
        }
        else{
            const certificate = new Certificate();
            certificate._id = c._id;
            certificate.title = c.title;
            certificate.description = c.description;
            await Certificate.findByIdAndUpdate(c._id, certificate)
        }
    }

    /* ----- Reference - silme - ekleme(pasif) - güncelleme ----- */
    references = body.references;
    const currentReferences = await Reference.find();
     for(let r of currentReferences){
        const result = references.findIndex(p=> p._id === r.id);
        if(result === -1){
            await Reference.findByIdAndRemove(r._id);
        }
     }

     for(let r of references){
        if(r._id === null){
            const reference = new Reference();
            reference._id = uuidv4();
            reference.subtitle = r.subtitle;
            reference.title = r.title;
            reference.phone = r.phone;
            reference.email = r.email;
            await reference.save();
        }
        else{
            const reference = new Reference();
            reference._id = r._id;
            reference.subtitle = r.subtitle;
            reference.title = r.title;
            reference.phone = r.phone;
            reference.email = r.email;
            await Reference.findByIdAndUpdate(r._id, reference)
        }
    }

    /* ----- Language - silme - ekleme - güncelleme ----- */
    languages = body.languages;
    const currentLanguages = await Language.find();
     for(let l of currentLanguages){
        const result = languages.findIndex(p=> p._id === l.id);
        if(result === -1){
            await Language.findByIdAndRemove(l._id);
        }
     }

     for(let l of languages){
        if(l._id === null){
            const language = new Language();
            language._id = uuidv4();
            language.name = l.name;
            await language.save();
        }
        else{
            const language = new Language();
            language._id = l._id;
            language.name = l.name;
            await Language.findByIdAndUpdate(l._id, language)
        }
    }

    /* ----- Interest - silme - ekleme - güncelleme ----- */
    interests = body.interests;
    const currentInterest = await Interest.find();
    for(let i of currentInterest){
        const result = interests.findIndex(p=> p._id === i.id);
        if(result === -1){
            await Interest.findByIdAndRemove(i._id);
        }
    }

    for(let i of interests){
        if(i._id === null){
            const interest = new Interest();
            interest._id = uuidv4();
            interest.name = i.name;
            await interest.save();
        }
        else{
            const interest = new Interest();
            interest._id = i._id;
            interest.name = i.name;
            await Interest.findByIdAndUpdate(i._id, interest)
        }
    }


    res.json({message: "Update is successful"})
})

// const port = process.env.PORT || 5000;

app.listen("5000", () => console.log("The application runs over http://localhost:5000."));