const client=require('./config/supabase')();
const repository=require('./repositories/tarefas')(client);
const app=require('./app')(repository);
app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('Estudai API iniciada.'));
