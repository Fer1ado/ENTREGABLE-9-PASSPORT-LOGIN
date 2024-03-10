

<h1  style="text-align:center" > <font color="red">npm start</font> para levantar el programa </h1> 

---
<h3  style="text-align:center" >----> TESTING ENTREGABLE 8 <---</h3> 

<br> 
<h5 style="text-align:center" >Crear archivo .env con misma variable de entorno que entregas previas</h5> 
<br>
<br>
<h5 style="text-align:center" >Listado de rutas sobre las que se trabajo para la entrega y comentarios</h5> 

| METODO             | RUTA | DESCRIPCION | COMMENTARIOS
| :---------------- | :------: | :------: | :------: |
| GET       |   localhost:8080/login   | vista de logín en hbs |  no requiere autenticación |
| POST            |    localhost:8080/register    | vista de registro de nuevo usuario en hbs  | no requiere autenticación |
| GET  |  localhost:8080/profile    |  vista de perfil de usuario registrado en hbs | requiere autenticación |
| GET   |  localhost:8080/api/session/login     | endpoint de manejo de payload de login | espera un body con los campos detallados en el Model de usuario |
| GET |  localhost:8080/api/session/logout   | endpoint de destrucción de session | evita que se pueda seguir navegando por las secciones que requieren autenticación |
| POST |  localhost:8080/api/session/register       | endpoint de manejo de payload de register | redirecciona a la pantalla de login cuando se completa el registro de usuario |
| GET |  localhost:8080/products  | ruta view de products con mongoose-paginate y sorting por precio| requiere autenticación |
| POST |  localhost:8080/products/api/cart/:cid/product/:pid   | prueba de manipulacion de productos en carrito linkeado al view de products-paginate | requiere autenticación |

<br>
<br>
<br>
<br>
<br>
<br>




---

<h3  style="text-align:center" >----> PREVIOS <---</h3> 


| METODO             | RUTA | DESCRIPCION | COMMENTARIOS
| :---------------- | :------: | :------: | :------: |
| GET       |   localhost:8080/api/products/:pid   | busqueda de productos en carrito por ID |
| GET POST            |    localhost:8080/api/products    | listar y agregar productos a la BD  | agregado pagginate, sort, limit y filtro por status (default = true)
| POST  |  localhost:8080/api/products/many    |  ruta de inserción masiva de productos a la BD |
| PUT DELETE   |  localhost:8080/api/products/:id    | rutas de modificación y eliminación de products de la BD |
| GET PUT DELETE |  localhost:8080/api/cart/:cid   | rutas de busqueda, edicion por array de productos y eliminación de carrito en la BD | Edición por array tiene que ser con el siguiente formato [{product: id, quantity: Intg},{},{}... todos los prods]
| GET POST |  /api/cart   | ruta de busqueda y creación de carritos |
| POST PUT DELETE  |  localhost:8080/api/cart/:cid/product/:pid   |  rutas de busqueda edicion y creación de productos dentro de carrito especifico en la BD |
| GET |  localhost:8080/home     | ruta view de home Handlebars | 
| GET |  localhost:8080/realtimeproducts   | ruta view de realtimeproducts Handlebars // Socket.io |
| GET |  localhost:8080/chat  | ruta view de chat Handlebars // Socket.io |
| GET |  localhost:8080/products  | ruta view de products con mongoose-paginate y sorting por precio|
| POST |  localhost:8080/products/api/cart/:cid/product/:pid   | prueba de manipulacion de productos en carrito linkeado al view de products-paginate |
| GET |  localhost:8080/cart/:cid  | ruta view de carrito en Handlebars |

<br>
<br>

##### FILTROS
- [x] Modificar el método GET / para que cumpla con los siguientes puntos:
- Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
- limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
- page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
- query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general
- sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento<br>
<br>

##### PAGINATE 
- [x]  El método GET deberá devolver un objeto con el siguiente formato:
{
status:success/error
payload: Resultado de los productos solicitados
totalPages: Total de páginas
prevPage: Página anterior
nextPage: Página siguiente
page: Página actual
hasPrevPage: Indicador para saber si la página previa existe
hasNextPage: Indicador para saber si la página siguiente existe.
prevLink: Link directo a la página previa (null si hasPrevPage=false)
nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}<br>
<br>

##### CART ROUTES
- [x] DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.<br>
- [x] PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada <br>
- [x] DELETE api/carts/:cid deberá eliminar todos los productos del carrito <br>
- [x] Para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.<br>
<br>

##### VIEWS ROUTES
- [x] Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
- Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.
- [x] agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito. 





---


   Desafío "Primera práctica de integración sobre tu ecommerce": 
   En este trabajo debemos hacer la conexión de nuestro proyecto con una base de datos: 
   Utilizaremos Mongo y mongoose para agregar el modelo de persistencia a nuestro proyecto
   Debemos crear una base de datos llamada "ecommerce" dentro de Mongodb Atlas, crear sus colecciones "carts", "messages", "products" y sus respectivos schemas 
   Debemos separar los managers de fileSystem de los managers de Mongodb en una sola carpeta "dao". Dentro de dao, agregar también una carpeta "models" donde vivirán los esquemas de Mongodb<br>
1. Creé la carpeta "dao" con las subcarpetas solicitadas
2. Creé el archivo ".env" para ocultar contraseñas
3. Modifiqué "app.js" para hacer la conexión con la base de datos e incluyo la nueva vista del chat
4. Modifiqué "views" para hacer una vista que contenga el chat
5. Se implemento persistencia de datos de MongoDB para el almacenamiento de productos, carritos y mensajes del chat.

  
6. #### Endpoints activos en el proyecto:

| METHOD              | ROUTE |
| :---------------- | :------: | 
| GET GET POST DELETE       |   <localhost:8080/realtimeproducts>  |
| GET            |    <localhost:8080/home>   | 
| GET GET POST DELETE    |  <localhost:8080/chat>   | 
| GET  |  <localhost:8080/api/products/:pid>   | 
| GET  |  <localhost:8080/api/products/:limit?>    | 
| POST  |  <localhost:8080/api/products>   | 
| POST |  <localhost:8080/api/products/many>   | 
| PUT DELETE |  <localhost:8080/api/products/:id>   |
| GET DELETE  |  <localhost:8080/api/cart/:cid>   |
| GET POST |  <localhost:8080/api/cart>   |
| POST |  <localhost:8080/api/cart/:cid/product/:pid>  |



<br>

> 
> #### NAVEGADOR: 
>
> 
>> :bulb: localhost:8080/realtimeproducts ----> para el socket de actualización en tiempo real  <br> 
>> :bulb: localhost:8080/chat ----> para el Chat con persistencia en MongoDB  <br> 
>>:bulb: localhost:8080/api/products ----> para el endpoint de manipulación de productos en la base de datos  <br> 
>>:bulb: localhost:8080/api/cart ----> para el endpoint de manipulación de carritos en la base de datos  <br> 
---

<h3  style="text-align:center" >----> PREVIOS <---</h3> 

> #### RUTAS:<br>
>
>> :bulb: localhost:8080/realtimeproducts ----> para el socket de actualización en tiempo real  <br> 
>>
>> :bulb: localhost:8080/home ----> para la vista de todos los productos en la tienda  <br>
>> 
>> :bulb: localhost:8080/ ----> Saludo
  
---


<h3  style="text-align:center" >----> PREVIOS <---</h3> 

#### 1. PRODUCTS

Método GET http://localhost:8080/api/products/  --> listado de todos los productos<br>
Método GET http://localhost:8080/api/products?limit=# --> Listado de productos con limite de registros<br>
Método GET http://localhost:8080/api/products/:pid --> Devuelve aquel producto que coincida con el ID<br>
Método DELETE http://localhost:8080/api/products/:pid ---> borra item de la base de datos<br>
Método PUT  http://localhost:8080/api/products/:pid ---> modifica el producto de la base de datos<br>
Método POST http://localhost:8080/api/products/ --> volcando un producto en el body lo agrega a la BD, el método solo valida que no haya campos nullishv y que el codigo de producto no este repetido <br>
<br>

Dummy JSON ---> PARA PROBAR RUTA POST http://localhost:8080/api/products/<br>
 {
  "title": "Batatas Fritas",
  "description": "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
  "price": 33824,
  "thumbnail": "/et/ultrices/posuere/cubilia/curae/donec.json",
  "code": "MA8755",
  "stock": 286,
  "status": true
 } <br>
<br>

#### 2. CART<br>

Método POST http://localhost:8080/api/cart --> Crea un carrito nuevo<br>
Método GET http://localhost:8080/api/cart/:cartId --> Devuelve contenido de carrito según ID<br>
Método POST http://localhost:8080/api/cart/:cartId/product/:productId --> Agrega productos al carrito de acuerdo al Id de carrito y producto a agregar.<br>
Método DELETE http://localhost:8080/api/cart/:cartId --> borra el carrito de la base de datos<br>

