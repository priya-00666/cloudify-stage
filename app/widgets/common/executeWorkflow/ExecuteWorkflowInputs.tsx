import type { FunctionComponent } from 'react';
import React from 'react';
import type { DateInputProps } from 'cloudify-ui-components/typings/components/form/DateInput/DateInput';
import InputsHelpIcon from '../inputs/InputsHelpIcon';
import InputFields from '../inputs/InputFields';
import type { OnChange } from '../inputs/types';
import YamlFileButton from '../inputs/YamlFileButton';
import type { BaseWorkflowInputs, OnCheckboxChange, UserWorkflowInputsState } from './types';
import { DateInput, Divider, Form, Header, Message } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';

const t = StageUtils.getT('widgets.common.deployments.execute');

function renderActionCheckbox(name: string, checked: boolean, onChange: OnCheckboxChange) {
    const { Checkbox } = Form;
    return (
        <Checkbox
            name={name}
            toggle
            label={t(`actions.${name}.label`)}
            help={t(`actions.${name}.help`)}
            checked={checked}
            onChange={onChange}
        />
    );
}

function renderCheckboxField(name: string, checked: boolean, onChange: OnCheckboxChange) {
    const { Field } = Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

export interface CommonExecuteWorflowProps {
    baseWorkflowInputs: BaseWorkflowInputs;
    userWorkflowInputsState: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
}

interface ExecuteWorkflowInputsProps extends CommonExecuteWorflowProps {
    errors: Record<string, string>;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onWorkflowInputChange: OnChange;
    showInstallOptions: boolean;
    onForceChange: OnCheckboxChange;
    onDryRunChange: OnCheckboxChange;
    onQueueChange: OnCheckboxChange;
    onScheduleChange: OnCheckboxChange;
    onScheduledTimeChange: DateInputProps['onChange'];
    toolbox: Stage.Types.Toolbox;
}

const ExecuteWorkflowInputs: FunctionComponent<ExecuteWorkflowInputsProps> = ({
    baseWorkflowInputs,
    userWorkflowInputsState,
    onYamlFileChange,
    fileLoading,
    onWorkflowInputChange,
    errors,
    toolbox,
    showInstallOptions,
    force,
    dryRun,
    queue,
    schedule,
    scheduledTime,
    onForceChange,
    onDryRunChange,
    onQueueChange,
    onScheduleChange,
    onScheduledTimeChange
}) => {
    return (
        <>
            {_.isEmpty(baseWorkflowInputs) ? (
                <Message content={t('noParams')} />
            ) : (
                <>
                    <YamlFileButton
                        onChange={onYamlFileChange}
                        dataType="execution parameters"
                        fileLoading={fileLoading}
                        iconButton
                    />
                    <InputsHelpIcon />
                </>
            )}

            <InputFields
                inputs={baseWorkflowInputs}
                onChange={onWorkflowInputChange}
                inputsState={userWorkflowInputsState}
                errorsState={errors}
                toolbox={toolbox}
            />
            {showInstallOptions && (
                <>
                    <Form.Divider className="">
                        <Header size="tiny">{t('actionsHeader')}</Header>
                    </Form.Divider>

                    {renderCheckboxField('force', force, onForceChange)}
                    {renderCheckboxField('dryRun', dryRun, onDryRunChange)}
                    {renderCheckboxField('queue', queue, onQueueChange)}

                    <Form.Field error={!!errors.scheduledTime}>
                        {renderActionCheckbox('schedule', schedule, onScheduleChange)}
                        {schedule && (
                            <>
                                <Divider hidden />
                                <DateInput
                                    name="scheduledTime"
                                    value={scheduledTime}
                                    defaultValue=""
                                    minDate={moment()}
                                    maxDate={moment().add(1, 'year')}
                                    onChange={onScheduledTimeChange}
                                />
                            </>
                        )}
                    </Form.Field>
                </>
            )}
        </>
    );
};

export default React.memo(ExecuteWorkflowInputs);