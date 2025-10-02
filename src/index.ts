import Server from './app';
import { databaseConnect } from './configs/databases/database';

databaseConnect(new Server());
