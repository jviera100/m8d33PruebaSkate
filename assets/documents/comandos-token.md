# generas nuevo token actualizando pagina

# estructura token:

color rojo = header no se modifica
data = color morado
secret key = color celeste

# funcion metodo sign o verify(trae data y variables de entornos)

logica funcion envia por ruta token y secret key y obtiene data(en que parte de la funcio?)

# Api Rest Full. Uso de req.params, req.body y req.query en las operaciones CRUD con solicitudes HTTP.

● req.params: Se utiliza en las operaciones Read (GET), Update (PUT) y Delete (DELETE) para capturar los parámetros de la ruta en la URL, generalmente un ID para buscar en la base de datos, API o en un archivo JSON.
  --ejemplo:
         //--Read (GET): Para obtener una tarea específica por su ID.//
                app.get('/tasks/:taskId', function(req, res) {
                    let taskId = req.params.taskId;
                    // Buscar la tarea en la base de datos y devolverla
                });
● req.body: Se utiliza en las operaciones Create (POST) y Update (PUT) para acceder a los datos enviados en el cuerpo de la solicitud HTTP, generalmente para agregar o actualizar datos en la base de datos, API o en un archivo JSON.
  --ejemplo:
          //--Create (POST): Para crear una nueva tarea.//
                app.post('/tasks', function(req, res) {
                    let newTask = req.body;
                    // Agregar la nueva tarea a la base de datos
                    });
● req.query: Se utiliza en la operación Read (GET) para leer los parámetros de consulta en la URL, generalmente para filtrar resultados en una base de datos, API o en un archivo JSON.
  --ejemplo:
          //--Read (GET): Para obtener tareas que coincidan con un estado específico (por ejemplo, completadas).
                app.get('/tasks', function(req, res) {
                    let status = req.query.status;
                    // Buscar las tareas que coincidan con el estado en la base de datos y devolverlas
                });
