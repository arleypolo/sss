async function fetchDataEmployees() {

    try {
        const response = await fetch('http://localhost:3000/empleados');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();


        const tableBody = document.getElementById('empleados-body');
        tableBody.innerHTML = '';

        data.forEach((empleado) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${empleado.nombre}</td>
                <td>${empleado.apellido}</td>
                <td>${empleado.departamento}</td>
                <td>${empleado.edad}</td>
                <td>${empleado.salario}</td>
                <td>${empleado.fecha_ingreso}</td>
                <td class="button-table">
                    <button onclick="editarEmpleado('${empleado.id}')">Editar</button>
                    <button onclick="eliminarEmpleado('${empleado.id}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


async function saveUser() {
    const Data = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        departamento: document.getElementById('departamento').value,
        edad: parseInt(document.getElementById('edad').value),
        salario: parseFloat(document.getElementById('salario').value),
        fecha_ingreso: document.getElementById('fecha_ingreso').value,
    };

    try {
        const response = await fetch('http://localhost:3000/empleados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error desconocido');
        }

        const result = await response.json();
        console.log('Usuario agregado:', result.message);
        fetchDataEmployees()
        alert('¡Usuario guardado con éxito!');
        document.getElementById('mi-formulario').reset();

    } catch (error) {
        console.error('Hubo un error al guardar el empleado:', error);
        alert('Error: ' + error.message);
    }
}

async function eliminarEmpleado(id) {
    try {
        const response = await fetch(`http://localhost:3000/empleados/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('No se pudo eliminar el empleado');
        }
        await fetchDataEmployees();
        alert('Empleado eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

let empleadoEditandoId = null;

async function editarEmpleado(id) {
    try {
        const response = await fetch(`http://localhost:3000/empleados/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener el empleado');
        const empleado = await response.json();

        document.getElementById('nombre').value = empleado.nombre;
        document.getElementById('apellido').value = empleado.apellido;
        document.getElementById('departamento').value = empleado.departamento;
        document.getElementById('edad').value = empleado.edad;
        document.getElementById('salario').value = empleado.salario;
        document.getElementById('fecha_ingreso').value = empleado.fecha_ingreso;

        empleadoEditandoId = id;
        document.getElementById('guardar-btn').style.display = 'none';
        document.getElementById('actualizar-btn').style.display = 'inline-block';
    } catch (error) {
        alert('Error al cargar empleado: ' + error.message);
    }
}

async function updateEmpleado() {
    if (!empleadoEditandoId) return;
    const Data = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        departamento: document.getElementById('departamento').value,
        edad: parseInt(document.getElementById('edad').value),
        salario: parseFloat(document.getElementById('salario').value),
        fecha_ingreso: document.getElementById('fecha_ingreso').value,
    };

    try {
        const response = await fetch(`http://localhost:3000/empleados/${empleadoEditandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)
        });
        if (!response.ok) throw new Error('No se pudo actualizar el empleado');
        await fetchDataEmployees();
        alert('Empleado actualizado correctamente');
        document.getElementById('mi-formulario').reset();
        empleadoEditandoId = null;
        document.getElementById('guardar-btn').style.display = 'inline-block';
        document.getElementById('actualizar-btn').style.display = 'none';
    } catch (error) {
        alert('Error al actualizar: ' + error.message);
    }
}




fetchDataEmployees()