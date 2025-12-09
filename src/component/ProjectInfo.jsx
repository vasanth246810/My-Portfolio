import {FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGithub, FaFigma} from 'react-icons/fa';
import {SiTailwindcss, SiJavascript, SiRedux, SiExpress,SiGit,SiVercel, SiPostman, SiDjango,SiMysql  } from 'react-icons/si';
import Eventify from '../assets/Eventify.png';
import { BsBootstrap } from "react-icons/bs";
import Tomato from '../assets/Tomato.png';

    
export const ProjectInfo=[
        {
            title:"Eventifyy",
            description:"A full-stack event management and ticket booking app built with React and Django. It features secure user authentication for login and registration, event discovery with browse and search capabilities, and real-time ticket booking with seat availability tracking.",
            image:Eventify,
            Link:"https://eventify-event-management-system.vercel.app/",
            GithubLink:"https://github.com/vasanth246810/Eventify-Event-Management-System",
            techStack:[{name:"ReactJs",icon:FaReact,color:"#61DAFB"},
            {name:"Django",icon:SiDjango,color:"#339933"},
            {name:"Css",icon:FaCss3Alt,color:"#61DAFB"},
            {name:"Bootstrap",icon:BsBootstrap,color:"#ef1cb3ff"},
            {name:"Mysql",icon:SiMysql,color:"rgba(244, 240, 27, 1)"}
            ]
        },

        {
            title:"Food Project",
            description:"A full-stack Food ordering app built with React and Django. It features secure user authentication for login and registration, event discovery with browse and search capabilities, and real-time ticket booking with seat availability tracking.",
            image:Tomato,
            techStack:[{name:"ReactJs",icon:FaReact,color:"#61DAFB"},
            {name:"Django",icon:SiDjango,color:"#339933"},
            {name:"Bootstrap",icon:BsBootstrap,color:"#ef1cb3ff"},
            {name:"Mysql",icon:SiMysql,color:"rgba(244, 240, 27, 1)"}
            ]
        },

    
    ]






