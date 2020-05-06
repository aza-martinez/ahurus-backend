const generateHTMLReciboExitoso = (path_logo_ahurus, transferencia) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Comprobante de pago</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        color: #575756;
        max-width: 612px;
        max-height: 792px;
        margin-left: 10%;
        margin-top: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .container,
      .content {
        width: 90%;
        font-family: sans-serif;
        margin: 10px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        letter-spacing: 1px;
      }
      .content {
        width: 90%;
        margin: 15px 0;
        justify-content: space-between !important;
        flex-direction: column;
        border: 1.3px solid #fe1f1f;
        padding: 15px 35px;
        border-radius: 7px;
        font-size: 10px;
      }
      .content-header {
        margin: 0 0 10px;
        display: inline-block;
        position: relative;
        width: 100%;
      }
      .content-header div {
        float: left;
        width: 25%;
        text-align: left;
      }
      .content-header div:last-child {
        width: 45%;
        margin-left: 30%;
        text-align: right;
      }
      .content-header div span span {
        color: #000831;
        font-weight: 700;
      }
      .container {
        padding: 0;
        margin: 0;
        display: inline-block;
      }
      .container .container-title {
        text-align: center;
        letter-spacing: 2px;
        font-size: 12px;
        flex-shrink: 0;
        float: right;
        line-height: 45px;
        margin-bottom: 8px;
      }
      .content-list {
        width: 100%;
      }
      .content-list ul {
        width: 100%;
        list-style: none;
        margin: 10px 0;
        padding: 0;
      }
      .content-list ul li {
        padding: 10px 0;
        border-top: 1px solid #dcdde1;
        text-align: center;
      }
      .content-list ul li span strong {
        margin: 0 10px;
        color: #000831;
      }
      .content-list ul li:last-child {
        border-bottom: 1px solid #dcdde1;
      }
    </style>
    <link
      href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="container">
      <picture>
        <img
          width="100"
          src="${path_logo_ahurus}"
        />
      </picture>
      <span class="container-title">Comprobante de Transferencia</span>
    </div>
    <div class="content">
      <div class="content-header">
        <div>
          <span><span>Orden:</span> ${transferencia.idSTP}</span>
        </div>
        <div>
          <span><span>Fecha de Operación:</span> ${transferencia.timestamp} </span>
        </div>
      </div>
      <div class="content-list">
        <ul>
          <li>
            <span>
              <strong>Clave de Rastreo:</strong>
              ${transferencia.claveRastreo}
            </span>
          </li>
          <li>
            <span>
              <strong>Tipo de Pago:</strong>
              Tercero a Tercero
            </span>
          </li>
          <li>
            <span>
              <strong>Estado:</strong>
              ${transferencia.estatus_stp}
            </span>
          </li>
          <li>
            <span>
              <strong>Importe:</strong>
              $ ${transferencia.monto}
            </span>
          </li>
          <li>
            <span>
              <strong>Ordenante:</strong>
              ${transferencia.nombreOrdenante}
            </span>
          </li>
          <li>
            <span>
              <strong>Cuenta:</strong>
              ${transferencia.cuentaOrdenante}
            </span>
          </li>
          <li>
            <span>
              <strong>Beneficiario:</strong>
              ${transferencia.nombreBeneficiario}
            </span>
          </li>
          <li>
            <span>
              <strong>RFC/CURP:</strong>
              ${transferencia.rfcCurpBeneficiario}
            </span>
          </li>
          <li>
            <span>
              <strong>Cuenta:</strong>
              ${transferencia.cuentaBeneficiario}
            </span>
          </li>
          <li>
            <span>
              <strong>Referencia Numérica:</strong>
              ${transferencia.referenciaNumerica}
            </span>
          </li>
          <li>
            <span>
              <strong>Concepto:</strong>
              ${transferencia.conceptoPago}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </body>
</html>
`;

module.exports = generateHTMLReciboExitoso;