import React from 'react';
import '../Styles/Navbar.css';
export function Navbar(){
return(
 <div style={{paddingTop:"30px"}}>
    <nav className='navbar d-flex justify-content-between align-items-center flex-column'>
        <ul className='navlinks'>
            <li><a href="#home" style={{textDecoration: 'none', color: 'inherit'}}>Home</a></li>
            <li><a href="#about" style={{textDecoration: 'none', color: 'inherit'}}>About</a></li>
            <li><a href="#projects" style={{textDecoration: 'none', color: 'inherit'}}>Projects</a></li>
            <li><a href="#contact" style={{textDecoration: 'none', color: 'inherit'}}>Contact</a></li>
        </ul>
    </nav>
</div>
);
}
