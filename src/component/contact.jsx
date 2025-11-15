import "../Styles/Contact.css";
import {useAnimation} from "./summa";
import {useRef} from 'react';
import emailjs from '@emailjs/browser';

export default function Contact(){

  // const {ref,classname}=UseRotateY(classname="");
  // const {ref,classname}=UseRotateX();
  const { ref: rotate, classname: rotateClass } = useAnimation("rotate-y");
  const { ref: Large, classname: LargeClass } = useAnimation("fade-up-large");
  const form = useRef();


const handleSubmit= (e)=>{
  e.preventDefault();
   const serviceId = 'service_hjl3bd9';
   const templateId = 'template_87e0oye';
   const publicKey = 'eFJytcy4HeMVp-6I0';

   emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
}

return (
  <section className="px-4 py-5">
    <div className="min-vh-100"style={{fontFamily:"Outfit,sans-serif"}}>
          <div className="container"style={{maxWidth:"900px"}}>
            <h4 className="text-center mb-2 fs-6 text-light fw-medium">GET IN TOUCH</h4>
            <h2 className="ContactShine d-flex justify-content-center align-items-center mb-5 fw-semibold" >Contact Me</h2>

            <div ref={Large} className={` ${LargeClass} w-100 border border-secondary rounded-3 p-4`} style={{minHeight:"500px"}}>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <a  ref={rotate} className={`${rotateClass} w-50 d-flex flex-grow-1 align-items-center justify-content-center gap-1 py-2 border border-secondary rounded fw-medium small`}>vasanthKumar49480@gmail.com</a>
                  <a ref={rotate} className={`${rotateClass} w-50 d-flex flex-grow-1 align-items-center justify-content-center gap-1 py-2 border border-secondary rounded fw-medium small`}>Whatsapp</a>
                </div>
                 
                <p ref={Large} className={` ${LargeClass}  text-light p-3 fw-medium text-center small`}> Or send a message</p>
                 <form ref={form} className="w-100" onSubmit={handleSubmit}>
                    <div ref={Large}  className={`${LargeClass}`}>
                      <input type="email" className="w-100 border rounded-2 px-4 py-2 "  name="email" placeholder="Email" style={{backgroundColor:"oklch(.205 0 0)"}} />
                    </div>
                    <div ref={Large}  className={`${LargeClass}`}>
                      <textarea rows="5" className="w-100 border rounded-2 px-4 py-3  mt-4" name="message" placeholder=" Your Message" style={{backgroundColor:"oklch(.205 0 0)"}} />
                    </div>
                    <button type="submit" ref={Large} className={` ${LargeClass} w-100  mt-4 d-flex justify-content-center border rounded px-4 py-2 font-medium small text-light`} style={{backgroundColor:"#0a0a0a"}}>Send Message</button>
                  </form>
            </div>
          </div>
    </div>
  </section>
);

}