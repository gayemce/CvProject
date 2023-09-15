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



    socialMedias = body.socialMedias;
    educations = body.educations;
    workExperiences = body.workExperiences;
    certificates = body.certificates;
    references = body.references;
    languages = body.languages;
    interests = body.interests;

    res.json({message: "Update is successful"})
})

// const port = process.env.PORT || 5500;

app.listen("5500", () => console.log("The application runs over http://localhost:5500."));