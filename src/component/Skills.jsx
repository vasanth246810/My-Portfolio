
import "../Styles/Skills.css";
import html from '../assets/html.png'
import css from '../assets/css.png'
import bootstrap from '../assets/bootstrap.png'
import javascript from '../assets/javascript.png'
import react from '../assets/react.png'
import github from '../assets/github.png'
import jquery from '../assets/jquery.png'
import sql from '../assets/sql.png'
import django from '../assets/django.png'
import python from '../assets/python.png'
import netlify from '../assets/netlify.png'
import postman from '../assets/postman.png'
import { useInView } from "react-intersection-observer";

 
export default function Skills(){
    const {ref,inView}=useInView({threshold:0.1});

    return(
    <div className="d-flex flex-column justify-content-center">
        <p className={`${inView ? "show" : ""} fade-in-up Skills d-flex align-items-center justify-content-center fw-bold  mb-5 text-light bg-clip-text`}>Skills</p>
        <div className=" imagediv gap-5 justify-content-center py-6 ">
            <div ref={ref} className={`imgpost rotate-y ${inView ? "show" : ""}`}><img src={html} alt="HTML"/><p>HTML</p></div>
            <div className="imgpost"><img src={css} alt="CSS"/><p>CSS</p></div>
            <div className="imgpost"><img src={bootstrap} alt="Bootstrap"/><p>Bootstrap</p></div>
            <div className="imgpost"><img src={javascript}alt="JavaScript"/><p>Javascript</p></div>
            <div className="imgpost"><img src={react} alt="React"/><p>React</p></div>
            <div className="imgpost"><img src={github} alt="GitHub"/><p>Git-Hub</p></div>
            <div className="imgpost"><img src={jquery} alt="JQuery"/><p>JQuerry</p></div>
            <div className="imgpost"><img src={sql} alt="MySQL"/><p>MySQL</p></div>
            <div className="imgpost"><img src={django} alt="Django"/><p>Django</p></div>
            <div className="imgpost"><img src={python} alt="Python"/><p>Python</p></div>
            <div className="imgpost"><img src={netlify} alt="Netlify"/><p>Netlify</p></div>
            <div className="imgpost"><img src={postman} alt="Netlify"/><p>Postman</p></div>
    </div>
    </div>
    );
}