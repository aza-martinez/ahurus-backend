const moment = require('moment');

const generateHTMLMail = (centroCosto, transferencia) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail</title>
  </head>
  <body bgcolor="#eeeeee" style="font-family: sans-serif; color: #191919;">
   <table style="border:0;" align="center" width="37%" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>
        <table style="width: 100%;" align="center" cellspacing="0" cellpadding="0">
          <tr>
            <td width="100%">
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
          <tbody>
            <tr bgcolor="#000831" style="text-align: center">
              <td width="100%" style="padding: 15px;">
                <a href="https://ahurus.com">
                  <img src="https://smahurus.blob.core.windows.net/assets/ahurus.svg" alt="Ahurus" width="95">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
                <tbody>
                  <tr bgcolor="#ffffff" style="color: #191919;">
                    <td style="padding: 15px 40px;">
                      <h1 style="font-size: 18px; margin-top: 35px;">Hola, ${centroCosto.nombre_contacto}:</h1>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
                <tbody>
                  <tr bgcolor="#ffffff" style="color: #191919;">
                    <td style="padding:0 40px;">
                      <p style="width: 80%; line-height: 23px;">La <strong>transferencia a </strong> ${transferencia.nombreBeneficiario} fue exitosa, te compartimos los detalles:</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td>
                      <table cellspacing="0" cellpading="0" align="center" width="90%" style="margin: 15px auto;">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td bgcolor="#f4f4f4" style="padding: 0; maring-right: 5px;">
                      <img src="https://smahurus.blob.core.windows.net/assets/info.svg" alt="info" width="40" style="padding: 50px 0 50px 30px;">
                    </td>
                    <td bgcolor="#f4f4f4" style=" color: #191919;">
                      <p style="line-height: 22px; font-size: 14px;">
                        Importe: ${transferencia.monto} <br>
                        Beneficiario: ${transferencia.nombreBeneficiario} <br>
                        Cuenta depósito: ${transferencia.cuentaBeneficiario.substr(-4)}
                      </p>
                    </td>
                  </tr>
                </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px;">
                      <p style="color: #4b4b4b; font-weight: 700; font-size: 13px;">DETALLES DE OPERACIÓN</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%;" cellspacing="0" cellpading="0" align="center">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px;">
                      <p style="color: #4b4b4b; font-weight: 500; font-size: 15px; margin: 0 0 5px;">Concepto:</p>
                      <p style="font-size: 16px; margin: 0;">${transferencia.conceptoPago}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%; padding-top:15px;" cellspacing="0" cellpading="0" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px; margin-top: 40px;">
                      <p style="color: #4b4b4b; font-weight: 500; font-size: 15px; margin: 0 0 5px;">Fecha:</p>
                      <p style="font-size: 16px; margin: 0;">${moment(transferencia.timestamp).format('l')}</p>                      
                    </td>
                  </tr>
                </tbody>
              </table>  
              <table style="width: 100%; min-width: 100%; padding-top:15px;" cellspacing="0" cellpading="0" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px; margin-top: 40px;">
                      <p style="color: #4b4b4b; font-weight: 500; font-size: 15px; margin: 0 0 5px;">Hora:</p>
                      <p style="font-size: 16px; margin: 0;">${moment(transferencia.timestamp).format('LT')}</p>                      
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%; padding-top:15px;" cellspacing="0" cellpading="0" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px; margin-top: 40px;">
                      <p style="color: #191919; font-weight: 500; font-size: 15px; margin: 0 0 5px;">Saludos,</p>                   
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%; padding-top:15px;" cellspacing="0" cellpading="0" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr bgcolor="#ffffff">
                    <td style="padding: 5px 40px; margin-top: 40px;">
                      <p style="color: #191919; font-weight: 500; font-size: 15px; margin: 0 0 5px;">Equipo Ahurus.</p>                   
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; min-width: 100%; padding-top:15px;" cellspacing="0" cellpading="0" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr>
                    <td>
                      
                    </td>
                  </tr>
                </tbody>
              </table>               
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
   </table>
  </body>
  </body>
</html>
`;

module.exports = generateHTMLMail;
