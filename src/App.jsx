import React, {useEffect, useState} from 'react';
import {firebase} from './firebase';


function App() {

    const [tareas, setTareas] = React.useState([]);
    //estado para una tarea nueva
    const [tarea, setTarea] = useState('');
    const [modoEdicion, setModoEdicion] = React.useState(false);
    const [ID, setID] = React.useState('');
    

    

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
  }, [tareas]) //cada vez que se modifique tareas se actualiza

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
      //formas mas compleja de agregar objeto nuevo a la lista, con esto se agrega abajo de la lista, sino pongo esto se agrega aleatoriamente
      setTareas([
       ...tareas, {...nuevaTarea, id: data.id} ]
     )
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async id=> {
    try {
      const db = firebase.firestore()
      //se agrega la funcion delete para eliminar informacion
      await db.collection('tareas').doc(id).delete()
      //filtro con los IDs distintos al id seleccionado
      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)
    } catch (error) {
      
    }
  }
    const activarEdicion = (item) => {
      setModoEdicion(true)
      setTarea(item.name)
      setID(item.id)
    }

    const editar = async (e) => {
      e.preventDefault()
      if(!tarea.trim()){
        console.log('vacio')
        return
      }
      try {
        const db = firebase.firestore()
        //update recibe un objeto que queremos actualizar, hay como pasar solo un atributo de un objeto
        await db.collection('tareas').doc(ID).update({
            name: tarea //campo que deseamos actualizar
        })
        const arrayEditado = tareas.map(
          item => (
            item.id === ID ? {id: item.id, fecha : item.fecha, name: tarea} : tarea
          )
        )
        //LIMPIAR LOS STATES
        setTareas(arrayEditado);
        setModoEdicion(false);
        setID('');
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
                <li className="list-group-item" key={item.id}> Nombre: {item.name} <br></br>Teléfono: {item.fecha}
                <br></br>
                <button className="btn-danger btn-sm float-right "
                onClick={() => eliminar(item.id)}
                >Eliminar</button>
                <button className="btn-warning btn-sm float-right m-2"
                onClick={()=> activarEdicion(item)}
                >Editar</button>
                </li>
                
              )
            )}
           
            
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Formulario</h3>
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }

          </h3>
          <form  onSubmit={ modoEdicion ? editar : agregar } >
            <input type="text" placeholder="Ingrese la Tarea" className="form-control mb-2" 
            onChange={e => setTarea(e.target.value)}
            value={tarea}/>
            <button className={
              modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
            }
            type="submit"

            >
              {modoEdicion ? 'Editar' : 'Agregar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
