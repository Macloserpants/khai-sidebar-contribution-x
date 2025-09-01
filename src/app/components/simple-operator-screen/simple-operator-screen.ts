import { OperatorScreen } from '@universal-robots/contribution-api';

export interface SimpleOperatorScreen extends OperatorScreen {
    type: 'simple-operator-screen';
    version: '0.0.1';
    parameters?: {
        [key: string]: any;
    };
}