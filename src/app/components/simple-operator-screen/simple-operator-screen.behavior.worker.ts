/// <reference lib="webworker" />
import {
    OperatorScreenBehaviors,
    registerOperatorScreenBehavior,
    ScriptBuilder,
    ValidationResponse,
} from '@universal-robots/contribution-api';
import { SimpleOperatorScreen } from './simple-operator-screen';


// factory is required
const createOperatorScreen = async (): Promise<SimpleOperatorScreen> => ({
    type: 'simple-operator-screen',
    version: '0.0.1',
    parameters: {},
});

// generateCodePreamble is optional
const generatePreambleScript = async (operatorScreen: SimpleOperatorScreen): Promise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (operatorScreen: SimpleOperatorScreen): Promise<ValidationResponse> => ({
    isValid: true,
});

const behaviors: OperatorScreenBehaviors = {
    factory: createOperatorScreen,
    validator: validate,
    generatePreamble: generatePreambleScript,
};

registerOperatorScreenBehavior(behaviors);