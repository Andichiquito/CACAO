import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        
        {/* Historia */}
        <div className="history-section">
          <h2 className="section-title">HISTORIA</h2>
          <div className="underline"></div>
          
          <div className="history-content">
            <p className="history-paragraph">
              <strong>Orígenes:</strong> CACAO nació del sueño de un niño de 13 años que quería abrir su propia pastelería.
            </p>
            
            <p className="history-paragraph">
              <strong>Inicios:</strong> En 2014, CACAO comenzó a vender productos en la feria de la Villarroel.
            </p>
            
            <p className="history-paragraph">
              <strong>Crecimiento:</strong> Debido a la demanda de los clientes, se abrió un local físico el 21 de septiembre de 2017.
            </p>
            
            <p className="history-paragraph">
              <strong>Éxito:</strong> Después de más de 7 años de trabajo duro, constancia y creatividad, CACAO se ha convertido en lo que es hoy.
            </p>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="mission-vision-container">
          
          {/* Misión */}
          <div className="mission-section">
            <h2 className="section-title">MISIÓN</h2>
            <div className="underline"></div>
            <p className="mission-text">
              Ser tu lugar favorito, donde disfrutes cada una de nuestras tortas y productos, hechos con amor, pasión y dedicación para ti.
            </p>
          </div>

          {/* Visión */}
          <div className="vision-section">
            <h2 className="section-title">VISIÓN</h2>
            <div className="underline"></div>
            <p className="vision-text">
              Aspiramos a marcar la diferencia en la repostería, creando experiencias únicas a través de sabores auténticos y propuestas originales. Nuestro objetivo es seguir creciendo, llegar a nuevos rincones y compartir la dedicación que hay detrás de cada creación, con la misma entrega y entusiasmo que nos inspiran cada día.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="logo-section">
          <div className="cacao-logo">
            <img src="/Logo blanco .PNG" alt="CACAO Logo" className="logo-image" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
