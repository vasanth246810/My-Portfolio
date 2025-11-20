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
  <section id="contact" className="px-4 py-5">
    <div className="min-vh-100"style={{fontFamily:"Outfit,sans-serif"}}>
          <div className="container"style={{maxWidth:"900px"}}>
            <h4 className="text-center mb-2 fs-6 text-light fw-medium">GET IN TOUCH</h4>
            <h2 className="ContactShine d-flex justify-content-center align-items-center mb-5 fw-semibold" >Contact Me</h2>

            <div ref={Large} className={` ${LargeClass} w-100 border border-secondary rounded-3 p-4`} style={{minHeight:"500px"}}>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <a ref={rotate} href="mailto:vasanthKumar49480@gmail.com" className={`${rotateClass} w-50 d-flex flex-grow-1 align-items-center justify-content-center gap-1 py-2 border border-secondary rounded fw-medium small`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    vasanthKumar49480@gmail.com
                  </a>
                  <a ref={rotate} href="https://wa.me/9600245586" target="_blank" className={`${rotateClass} w-50 d-flex flex-grow-1 align-items-center justify-content-center gap-1 py-2 border border-secondary rounded fw-medium small`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                    Whatsapp
                  </a>
                </div>
                 
                <p ref={Large} className={` ${LargeClass}  text-light p-3 fw-medium text-center small`}> Or send a message</p>
                 <form ref={form} className="w-100" onSubmit={handleSubmit}>
                    <div ref={Large}  className={`${LargeClass}`}>
                      <input type="email" className="w-100 border rounded-2 px-4 py-2 "  name="email" placeholder="Email" style={{backgroundColor:"oklch(.205 0 0)", color:"white"}} />
                    </div>
                    <div ref={Large}  className={`${LargeClass}`}>
                      <textarea rows="5" className="w-100 border rounded-2 px-4 py-3  mt-4" name="message" placeholder=" Your Message" style={{backgroundColor:"oklch(.205 0 0)",color:"white"}} />
                    </div>
                    <button type="submit" ref={Large} className={` ${LargeClass} w-100  mt-4 d-flex justify-content-center border rounded px-4 py-2 font-medium small text-light`} style={{backgroundColor:"#0a0a0a"}}>Send Message</button>
                  </form>
            </div>
          </div>
    </div>
  </section>
);

}