

import React from 'react';
import '../Styles/Navbar.css';
export function Navbar(){
return(
 <div>
    <nav className='navbar d-flex justify-content-between align-items-center flex-column'>
        <ul className='navlinks'>
            <li>Home</li>
            <li>About</li>
            <li>Projects</li>
            <li>Contact</li>
        </ul>
    </nav>
</div>
);
}