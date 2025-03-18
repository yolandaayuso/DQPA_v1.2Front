import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';

const Politica = () => {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        bgcolor: '#F9F9F9',
        color: '#1e4b81',
        textAlign: 'center',
      }}
    >
      {/* Encabezado */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, color: '#d37d36' }}
      >
        Política de Privacidad
      </Typography>

      {/* Contenido Principal */}
      <Grid container spacing={4} justifyContent="center">
        {/* Valoramos su privacidad */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Valoramos su privacidad
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              A través de esta política de privacidad, le informamos sobre la información que recopilamos de nuestros usuarios y cómo la utilizamos. Le instamos a revisar detenidamente estos términos antes de proporcionar sus datos en este sitio web.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Hemos trabajado arduamente para establecer un entorno seguro y confiable, y queremos compartir con usted nuestros principios sobre privacidad:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Solo solicitamos información personal cuando es estrictamente necesaria para brindarle los servicios que solicita.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Nunca compartimos la información personal de nuestros usuarios con terceros, a menos que sea necesario para cumplir con la ley o cuente con tu autorización expresa.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Jamás utilizamos sus datos personales con fines distintos a los establecidos en esta política de privacidad.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Es importante señalar que esta Política de Privacidad puede cambiar según requisitos legislativos o autorregulaciones, por lo que le recomendamos revisarla periódicamente. Se aplicará en caso de que decida completar algún formulario en nuestro sitio web donde se solicite información personal.
            </Typography>
            <Typography variant="body1">
              El tratamiento de los datos del usuario por parte de DQPa para envío de comunicaciones, así como registro y uso de la web está basado en el interés legítimo de DQPa de conformidad con lo establecido en el RGPD.
            </Typography>
          </Card>
        </Grid>

        {/* Responsable */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              ¿Quién es el responsable del tratamiento de sus datos?
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Responsable:</strong> DQTeam S.L
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Correo electrónico:</strong> dqpa@dqteam.es
            </Typography>
            <Typography variant="body2">
              <strong>Dirección postal:</strong> Instituto de Tecnologías y Sistemas de Información, Camino de Moledores S/N, Ciudad Real, 13003, España
            </Typography>
          </Card>
        </Grid>

        {/* Principios */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Principios que aplicaremos sobre su información personal
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Principio de licitud, lealtad y transparencia: Siempre vamos a requerir su consentimiento para el tratamiento de sus datos personales.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Principio de minimización de datos: Solo vamos a solicitar datos estrictamente necesarios en relación con los fines para los que los requerimos.
            </Typography>
            <Typography variant="body2">
              • Principio de integridad y confidencialidad: Sus datos serán tratados de tal manera que se garantice una seguridad adecuada de los datos personales y se garantice confidencialidad.
            </Typography>
          </Card>
        </Grid>

        {/* Cómo se obtienen los datos */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              ¿Cómo hemos obtenido los datos?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Los datos personales que tratamos en DQPa proceden de:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>Formulario de registro de usuario:</strong> Se solicitan datos como email y contraseña. Para planes premium, se solicitan nombre de la empresa, número de empleados, sector y ubicación.
            </Typography>
            <Typography variant="body2">
              • <strong>Formulario de contacto:</strong> Solo se solicita el email.
            </Typography>
          </Card>
        </Grid>

        {/* Secreto y seguridad */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Secreto y seguridad de los datos
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              DQPa se compromete en el uso y tratamiento de los datos personales de los usuarios, respetando su confidencialidad y a utilizarlos de acuerdo con la finalidad establecida, así como a cumplir con su obligación de guardarlos y adaptar todas las medidas necesarias para evitar alteración, pérdida, tratamiento o acceso no autorizado.
            </Typography>
            <Typography variant="body1">
              Sin embargo, DQPa no puede garantizar la absoluta inexpugnabilidad de la red Internet y, por tanto, la violación de los datos mediante accesos fraudulentos por parte de terceros.
            </Typography>
          </Card>
        </Grid>

        {/* Cambios en la política */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              textAlign: 'left',
              borderRadius: '10px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Cambios en la política de privacidad
            </Typography>
            <Typography variant="body1">
              DQPa se reserva el derecho a modificar la presente política para adaptarla a novedades legislativas o jurisprudenciales, así como a prácticas de la industria. En dichos supuestos, DQPa anunciará los cambios con antelación.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Politica;
