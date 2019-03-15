<?php

$accion =$_POST['accion'];
$proyecto=$_POST['proyecto'];

if ($accion === 'crear') {
    /**Importar la conexion */
include '../funciones/conexion.php';

    try {
        /**Realizar consulta a la base de datos */
                $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) " );
                $stmt->bind_param( 's' , $proyecto );
                $stmt->execute();
                if ($stmt->affected_rows == 1) {
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'id_insertado' => $stmt->insert_id,
                        'tipo' => $accion,
                        'nombre_proyecto'=>$proyecto
                    );
                }else{
                    $respuesta= array(
                        'respuesta'=>'error'
                    );
                }
                 $stmt->close();
                $conn->close();
            } catch (Exception $e) {
                $respuesta = array(
                    'pass' => $e->getMessage()
                );
            }
        
            echo json_encode($respuesta);
        }