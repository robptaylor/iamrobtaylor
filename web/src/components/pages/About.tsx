import React from 'react';
import imgUrl from './me.jpg';
import './About.css';

function About(){
    return (
        <div id="about-page">
            <div id='about-row'>
                <img className='me' src={imgUrl} alt='rob taylor' height={351} width={200}></img>
                <div>
                    <p>I am Rob Taylor, a software engineer based in Bristol, UK. I enjoy exploring new programming languages, building systems and finding simple solutions to complex problems.  I have two sons (aged 3 and 6) and know every word to every Bluey episode ever made. In my spare time (lol) I enjoy cycling and watching baseball.</p>
                    <p>If you'd like to see the code for this website it's <a href='https://github.com/robptaylor/iamrobtaylor'>here</a>, use it as you wish.</p>
                </div>
            </div>
        </div>
    ) 
}

export default About;