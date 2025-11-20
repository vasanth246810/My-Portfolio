

import { useState } from 'react';
import "../Styles/Projects.css";
import { ProjectInfo } from './ProjectInfo';
import {useInView} from "react-intersection-observer";
import github from '../assets/github.png';
import Link from '../assets/Link.png'


export default function Projects(){
    const [hoveredCards, setHoveredCards] = useState(new Array(ProjectInfo.length).fill(false));
    const {ref,inView}=useInView({thershold:0.1});

    return(
        <section id="projects" className="px-4 py-5">
        <div className="ProjectHeader min-vh-100">    
         <h4 ref={ref} className={`fade-right ${inView ? "show" : ""} text-center mb-2 fs-6 text-light`}>EXPLORE MY CREATIONS</h4>    
         <h1  ref ={ref} className={`${inView ? "show" : ""} fade-in-up ProjectName d-flex align-items-center justify-content-center fw-bold  mb-5 text-light bg-clip-text`}>Projects</h1>
         <div ref={ref} className={`${inView ? "show" : ""} fade-up-large container`}>
        {ProjectInfo.map((ProjectInfo,index)=>(

            <div key={index} className="text-light border rounded-8 position-sticky my-5"style={{maxWidth:"900px", margin:"auto", minHeight:"400px" ,borderRadius:"1rem" ,top:`calc(72px + ${index * 30}px)`,backgroundColor:"#0a0a0a"}} >
                <div className="row g-4" style={{minheight:"400px"}}>
                 <div className="col-lg-6 p-5">
                    <h3 className="border-bottom pb-2">{ProjectInfo.title}</h3>
                    <p className="mt-2">{ProjectInfo.description}</p>
                   
                    {/* <ul className="ps-0"style={{listStyle:"none"}}>
                         {ProjectInfo.features.map((features,index)=>(
                        <li key={index} className="pt-2">- {features}</li>
                        ))}
                    </ul> */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {ProjectInfo.techStack.map((techStack,index)=>(
                            <span key={index} className=" gap-2 badge rounded-pill px-3 py-2 bg-opacity-25 border border-secondary d-flex align-items-center">
                                <techStack.icon style={{color: techStack.color}} /> {techStack.name}
                            </span>))}
                    </div>
                    <div className='ProjectSourceMain d-flex gap-4 mt-3'>
                        <a className='ProjectSource'>
                            <img src={github} className="mt-1" height="14px"/>
                        Github
                        </a>
                        <a className='ProjectSource'>
                            <img src={Link} className="mt-1" height="14px"/>
                        Live
                        </a>
                    </div>
               </div>

                <div className='col-lg-6'>
                  <div  className="image-container" style={{height: '100%', overflow: 'hidden', borderRadius: '8px'}} onMouseEnter={() => setHoveredCards(prev => prev.map((h, i) => i === index ? true : h))} onMouseLeave={() => setHoveredCards(prev => prev.map((h, i) => i === index ? false : h))}>
                    <img src={ProjectInfo.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
               </div>
               </div>
               <div className={`project-overlay ${hoveredCards[index] ? 'show' : ''}`}>
                     <img src={ProjectInfo.image} alt="Full project" />
                  </div>
            </div>    
))}
            </div>
        </div>
        </section>
    );


}