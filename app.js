document.getElementById('searchBtn').addEventListener('click', consultarCCT);

async function consultarCCT() {
  const cctInput = document.getElementById('cctInput').value.trim().toUpperCase();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (cctInput === '') {
    resultDiv.innerHTML = '<p style="color:red;">Por favor, ingresa una CCT válida.</p>';
    return;
  }

  try {
    const response = await fetch('datos.json');
    const escuelas = await response.json();

    const resultado = escuelas.find(item => item.CCT === cctInput);

    if (resultado) {
      resultDiv.innerHTML = `
        <div style="border: 1px solid #0b2618; padding: 15px; border-radius: 6px; background-color: #f0fdf4;">
          <h3>${resultado.Nombre_Escuela}</h3>
          <p><strong>CCT:</strong> ${resultado.CCT}</p>
          <p><strong>Municipio:</strong> ${resultado.Municipio}</p>
          <p><strong>Fecha de Asamblea:</strong> ${resultado.Fecha_Asamblea}</p>
          <p><strong>Hora:</strong> ${resultado.Hora_Asamblea}</p>
          <p><strong>Sede:</strong> ${resultado.Lugar}</p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">No se encontró información programada para la CCT: <strong>${cctInput}</strong>.</p>`;
    }
  } catch (error) {
    console.error('Error al cargar la información:', error);
    resultDiv.innerHTML = '<p style="color:red;">Ocurrió un error al consultar la base de datos.</p>';
  }
}
