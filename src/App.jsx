import React, {useEffect, useState} from 'react';
import {firebase} from './firebase';


function App() {

    const [tareas, setTareas] = React.useState([]);
    //estado para una tarea nueva
    const [tarea, setTarea] = useState('')
    

    

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        //inicio el llamado a firestore
        const db = firebase.firestore()
        const data = await db.collection('tareas').get()
        console.log(data.docs)
        //con esto puedo armar los objetos, los tres puntitos son para incluir a todos 
        //los atributos del objeto
        const arrayData = await data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        console.log(arrayData);
        setTareas(arrayData);

      } catch (error) {
        console.log(error);
        
      }
    }
    obtenerDatos();
  }, [tareas])

  const agregar = async (e) => {
    e.preventDefault()
    //es importante hacer esta validacion para verificar que el campo no este vacio
    if(!tarea.trim()){
      console.log('está vacío!')
      return
    }
    console.log(tarea);
    //validacion de la consulta a la base de datos de firebase
    try {
      const db = firebase.firestore()
      const nuevaTarea = {
        name: tarea,
        //esto sirve para tomar la fecha de la llamada de la funcion
        fecha: Date.now()
      }
      //con add el id se agrega de manera aleatoria
      const data = await db.collection('tareas').add(nuevaTarea)
      setTarea('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-3 ">
      <h1>hola amigos, esta es la lista de mis tareas</h1>
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {tareas.map(
              item => (
                //es muy necesario que tenga un key, sino no funciona
                <li className="list-group-item" key={item.id}> Nombre: {item.name} <br></br>Teléfono: {item.fecha}</li>
              )
            )}
            
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Formulario</h3>
          <form action="" onSubmit={agregar}>
            <input type="text" placeholder="Ingrese la Tarea" className="form-control mb-2" 
            onChange={e => setTarea(e.target.value)}
            value={tarea}/>
            <button className="btn btn-dark"
            type="submit"
            >Agregar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
