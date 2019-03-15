<?php

$conn = new mysqli('localhost', 'root','123456','uptask'); /**esto nos crea un nueva conexion */

/**para comprobar la conexion 

echo "<pre>";
  var_dump($conn->ping());
echo "</pre>";
tambien se acompaña con

if($conn->connect_error){
echo  $conn->connect_error;

}
]
*/
/**Para que al imprimir de las base de datos aparecan los acentos y las ñ
 */

 $conn->set_charset('utf8');

 
