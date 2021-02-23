import React,{useEffect,useState} from 'react';
import './App.css';
import {Table,Button,Modal,Form,Input} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';


const {Item} = Form;
const baseUrl = "http://localhost:3002/artistas";

const layout = {
  labelCol:{
    span: 8
  },
  wrapperCol:{
    span: 16
  }
};

function App() {
  const [data,setData] = useState([]);
  const [modalInsertar,setModalInsertar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [modalEliminar,setModalEliminar] = useState(false);

  const [artista,setArtista] = useState({
    id:'',
    artista:'',
    pais:'',
    periodo:''
  });

  const handleChange = e =>{
    const {name,value} = e.target;
    setArtista({...artista,[name]:value});
    console.log(artista);
  }

  const seleccionarArtista = (artista,caso) => {
    setArtista(artista); 
    (caso === "Editar") ? abrirCerrarModalEditar():abrirCerrarModalEliminar();
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Artista',
      dataIndex: 'artista',
      key: 'artista'
    },
    {
      title: 'Pais',
      dataIndex: 'pais',
      key: 'pais'
    },
    {
      title: 'Periodo de actividad',
      dataIndex: 'periodo',
      key: 'periodo'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (fila) => (
        <>
          <Button type="primary" onClick = {()=>seleccionarArtista(fila,"Editar")}>Editar</Button>

          <Button type="primary" danger onClick = {()=>seleccionarArtista(fila,"Eliminar")}>Eliminar</Button>
        </>
      )
    }
  ];
  
  const peticionGet = async () => {
    await axios.get(baseUrl).then(response=>{
      setData(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionPost = async () => {
    await axios.post(baseUrl,artista).then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionPut = async () => {
    await axios.put(baseUrl+"/"+artista.id ,artista).then(response=>{
      let dataAuxiliar = data;
      dataAuxiliar.map(elemento => {
        if(elemento.id === artista.id){
          elemento.artista = artista.artista;
          elemento.pais = artista.artista;
          elemento.periodo = artista.periodo;
        }
      });
      setData(dataAuxiliar);
      abrirCerrarModalEditar();
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl+"/"+artista.id).then(response=>{
      setData(data.filter(elemento=>elemento.id!==artista.id));
      abrirCerrarModalEliminar();
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
      <h1>Tabla de cantantes</h1>
      <Button type="primary" onClick={abrirCerrarModalInsertar}>Agregar Cantante</Button>
      <br/>
      <br/>
      <Table columns = {columns} dataSource={data}/>

      <Modal
        visible = {modalInsertar}
        title = "Insertar Artista"
        destroyOnClose = {true}
        onCancel={abrirCerrarModalInsertar}
        centered
        footer = {[
          <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>,
          <Button type="primary" onClick={peticionPost}>Ingresar</Button>
        ]}
      >
        <Form {...layout}>
          <Item label="Artista">
            <Input name="artista" onChange={handleChange} />
          </Item>
          <Item label="Pais">
            <Input name="pais" onChange={handleChange} />
          </Item>
          <Item label="Periodo de actividad">
            <Input name="periodo" onChange={handleChange} />
          </Item>
        </Form>
      </Modal>


      <Modal
        visible = {modalEditar}
        title = "Editar Artista"
        onCancel={abrirCerrarModalEditar}
        centered
        footer = {[
          <Button onClick={abrirCerrarModalEditar}>Cancelar</Button>,
          <Button type="primary" onClick= {peticionPut}>Editar</Button>
        ]}
      >
        <Form {...layout}>
          <Item label="Artista">
            <Input name="artista" onChange={handleChange} value={artista && artista.artista} />
          </Item>
          <Item label="Pais">
            <Input name="pais" onChange={handleChange} value={artista && artista.pais}/>
          </Item>
          <Item label="Periodo de actividad">
            <Input name="periodo" onChange={handleChange}value={artista && artista.periodo}/>
          </Item>
        </Form>
      </Modal>

      <Modal
        visible = {modalEliminar}
        title = "Eliminar Artista"
        destroyOnClose = {true}
        onCancel={abrirCerrarModalEliminar}
        centered
        footer = {[
          <Button onClick={abrirCerrarModalEliminar}>Cancelar</Button>,
          <Button type="primary" onClick={peticionDelete} danger>Eliminar</Button>
        ]}
      >
        Estas seguro que deseas eliminar el artista <b>{artista && artista.artista}</b>?
      </Modal>

    </div>
  );
}

export default App;
