document.getElementById('cctInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    consultarCCT();
  }
});
document.getElementById('searchBtn').addEventListener('click', consultarCCT);

// También permite consultar presionando Enter
document.getElementById('cctInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    consultarCCT();
  }
});

async function consultarCCT() {
  const inputRaw = document.getElementById('cctInput').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  // Limpiamos la CCT ingresada: quitamos espacios y la convertimos a mayúsculas
  const cctBuscada = inputRaw.trim().replace(/\s+/g, '').toUpperCase();

  if (cctBuscada === '') {
    resultDiv.innerHTML = '<p style="color:red; font-weight:bold;">Por favor, ingresa una CCT válida.</p>';
    return;
  }

  // Mostramos mensaje de carga
  resultDiv.innerHTML = '<p style="color:#666;">Buscando información...</p>';

  try {
    const response = await fetch('datos.json');
    
    if (!response.ok) {
      throw new Error(`No se pudo cargar el archivo datos.json (Status: ${response.status})`);
    }

    const escuelas = await response.json();

    // Buscamos coincidencia revisando cualquier columna que pueda contener la CCT
    const resultado = escuelas.find(item => {
      // Busca la propiedad CCT sin importar si está en mayúsculas o minúsculas en el JSON
      const claveCCT = item.CCT || item.cct || item.Clave || item.clave || item.CCT_ESCUELA;
      if (!claveCCT) return false;
      return String(claveCCT).trim().replace(/\s+/g, '').toUpperCase() === cctBuscada;
    });

    if (resultado) {
      // Obtenemos los valores soportando diferentes nombres de columnas en el JSON
      const nombreEscuela = resultado.Nombre_Escuela || resultado.NOMBRE_ESCUELA || resultado.Escuela || resultado.escuela || 'No especificado';
      const cct = resultado.CCT || resultado.cct || cctBuscada;
      const municipio = resultado.Municipio || resultado.MUNICIPIO || resultado.municipio || 'No especificado';
      const fecha = resultado.Fecha_Asamblea || resultado.FECHA || resultado.Fecha || 'Por confirmar';
      const hora = resultado.Hora_Asamblea || resultado.HORA || resultado.Hora || 'Por confirmar';
      const lugar = resultado.Lugar || resultado.SEDE || resultado.Sede || 'No especificado';

      resultDiv.innerHTML = `
        <div style="border: 2px solid #103923; padding: 20px; border-radius: 8px; background-color: #f0fdf4; margin-top: 15px;">
          <h3 style="color: #691c32; margin-top: 0;">${nombreEscuela}</h3>
          <p><strong>CCT:</strong> ${cct}</p>
          <p><strong>Municipio:</strong> ${municipio}</p>
          <p><strong>Fecha de Asamblea:</strong> ${fecha}</p>
          <p><strong>Hora:</strong> ${hora}</p>
          <p><strong>Lugar / Sede:</strong> ${lugar}</p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div style="border: 1px solid #d32f2f; padding: 15px; border-radius: 6px; background-color: #ffebee; color: #c62828; margin-top: 15px;">
          No se encontró información programada para la CCT: <strong>${cctBuscada}</strong>.
        </div>
      `;
    }
  } catch (error) {
    console.error('Error durante la consulta:', error);
    resultDiv.innerHTML = `
      <div style="border: 1px solid #d32f2f; padding: 15px; border-radius: 6px; background-color: #ffebee; color: #c62828; margin-top: 15px;">
        <strong>Error de lectura:</strong> Asegúrate de que el archivo <code>datos.json</code> existe en la raíz de tu repositorio y está bien estructurado.
      </div>
    `;
  }
}
