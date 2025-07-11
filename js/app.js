// Configuración
const pwd = 'verite2025'; // Cambiar en producción
const commentPwd = "comentarios2025";

// Navegación entre guiones
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function navigateTo(page) {
  const attempt = prompt('Ingresa la contraseña para cambiar de guion:');
  if (attempt === pwd) {
    window.location.href = page;
  } else {
    alert('Contraseña incorrecta.');
  }
}

if (prevBtn && typeof prevPage !== 'undefined' && prevPage) {
  prevBtn.addEventListener('click', () => navigateTo(prevPage));
} else if (prevBtn) {
  prevBtn.style.display = 'none';
}

if (nextBtn && typeof nextPage !== 'undefined' && nextPage) {
  nextBtn.addEventListener('click', () => navigateTo(nextPage));
} else if (nextBtn) {
  nextBtn.style.display = 'none';
}

// Referencias DOM
const formSection    = document.getElementById('form-section');
const displaySection = document.getElementById('display-section');
const form           = document.getElementById('upload-form');
const unlockBtn      = document.getElementById('unlock-btn');
const hdrCliente     = document.getElementById('hdr-cliente');
const hdrFecha       = document.getElementById('hdr-fecha');
const hdrLugar       = document.getElementById('hdr-lugar');
const hdrTipo        = document.getElementById('hdr-tipo');
const hdrComments    = document.getElementById('hdr-comentarios');
const scriptContent  = document.getElementById('script-content');

const commentsContainer = document.getElementById("comments-container");
const commentForm = document.getElementById("comment-form");
const commentKey = document.getElementById("comment-key");
const commentText = document.getElementById("comment-text");
let commentsCollection;
// Inicializo referencia a subcolección de comentarios si existe docRef
if (typeof docRef !== 'undefined') {
  commentsCollection = docRef.collection('comments');
}

// Al cargar, trato de obtener datos de Firestore
docRef.get().then(doc => {
  if (doc.exists) {
    renderScript(doc.data());
  }
});

// Al enviar formulario, guardo en Firestore
form.addEventListener('submit', e => {
  e.preventDefault();
  const file = document.getElementById('file-input').files[0];
  if (!file) return alert('Selecciona un archivo .txt');
  const reader = new FileReader();
  reader.onload = () => {
    const meta = {
      cliente:    document.getElementById('cliente').value,
      fecha:      document.getElementById('fecha').value,
      lugar:      document.getElementById('lugar').value,
      tipo:       document.getElementById('tipo').value,
      comentarios:document.getElementById('comentarios').value,
      contenido:  reader.result
    };
    docRef.set(meta).then(() => renderScript(meta))
                .catch(err => alert('Error al guardar: ' + err));
  };
  reader.readAsText(file, 'UTF-8');
});

// Función para mostrar el guion
function renderScript(data) {
  formSection.classList.add('hidden');
  displaySection.classList.remove('hidden');
  hdrCliente.textContent  = data.cliente;
  hdrFecha.textContent    = data.fecha;
  hdrLugar.textContent    = data.lugar;
  hdrTipo.textContent     = data.tipo;
  hdrComments.textContent = data.comentarios;
  scriptContent.textContent = data.contenido;
}

// Volver atrás con contraseña: borro doc en Firestore
unlockBtn.addEventListener('click', () => {
  const attempt = prompt('Ingresa la contraseña para editar el guion:');
  if (attempt === pwd) {
    docRef.delete().then(() => location.reload())
                   .catch(err => alert('Error: ' + err));
  } else {
    alert('Contraseña incorrecta.');
  }
});

// Comentarios del cliente
function renderComment(id, data) {
  const div = document.createElement('div');
  div.className = 'comment-box';
  const p = document.createElement('p');
  p.textContent = data.text;
  div.appendChild(p);

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Eliminar';
  delBtn.className = 'delete-btn';
  delBtn.addEventListener('click', () => {
    const attempt = prompt('Ingresa la contraseña para borrar el comentario:');
    if (attempt === commentPwd) {
      commentsCollection.doc(id).delete();
    } else {
      alert('Clave incorrecta.');
    }
  });
  div.appendChild(delBtn);

  commentsContainer.appendChild(div);
}

if (commentForm) {
  // Cargar comentarios existentes
  if (commentsCollection) {
    commentsCollection.orderBy('timestamp').onSnapshot(snap => {
      commentsContainer.innerHTML = '';
      snap.forEach(doc => renderComment(doc.id, doc.data()));
    });
  }

  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    if (commentKey.value === commentPwd) {
      commentsCollection.add({
        text: commentText.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(err => alert('Error al guardar: ' + err));
      commentText.value = '';
    } else {
      alert('Clave incorrecta.');
    }
  });
}
