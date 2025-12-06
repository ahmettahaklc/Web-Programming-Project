
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';
import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
const Communication = () => {
  const contactRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);

  return (
  <Container
    fluid
    ref={contactRef}
    className={`bg-dark text-white py-5 px-5 contact-container ${
      isVisible ? "active" : ""
    }`}
  >
    <h2 className="text-center mb-5">Bize Ulaşın</h2>
    <Row>
      {/* Sol Taraf */}
      <Col md={6}>
        <p>
          Dünyanın dört bir yanındaki önde gelen hukuk profesyonelleri için en iyi rehber
        </p>
        <p>
          Sorularınız varsa veya bir temsilci ile görüşmek isterseniz, bizimle iletişime geçmekten çekinmeyin...
        </p>
        <p><strong>Genel Sorular:</strong><br/>+44 (0) 870 977 1000<br/>office@global.law</p>
        <p><strong>Öneri/Başvuru:</strong><br/>applications@global.law</p>
        <p><strong>Reklam:</strong><br/>sales@global.law</p>

        <h5>Birmingham Ofisi:</h5>
        <p>Regus Binası, Watling Court, Staffordshire, WS11 0EL</p>

        <h5>London Ofisi:</h5>
        <p>124 City Road, London, EC1V 2NX</p>

        <h5>Dubai Ofisi:</h5>
        <p>Dubai South İş Merkezi, P.O. Box 282228, Dubai</p>
      </Col>

      {/* Sağ Taraf */}
      <Col md={6}>
        <h4>Bize Mesaj Gönderin</h4>
        <Form>
          <Row>
            <Col><Form.Group className="mb-3">
              <Form.Control type="text" placeholder="İsim" />
            </Form.Group></Col>
            <Col><Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Soyisim" />
            </Form.Group></Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Firma" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="E-posta Adresi *" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Konu" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control as="textarea" rows={4} placeholder="Mesajınız *" />
          </Form.Group>

          {/* Simüle edilmiş reCAPTCHA */}
          <div className="mb-3">
            <input type="checkbox" id="captcha" />
            <label htmlFor="captcha" className="ms-2">Ben robot değilim</label>
          </div>

          <Button variant="primary" type="submit">Gönder</Button>
        </Form>
      </Col>
    </Row>
  </Container>
);

};

export default Communication;
