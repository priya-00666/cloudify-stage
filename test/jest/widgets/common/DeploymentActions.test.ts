import DeploymentActions from 'common/src/DeploymentActions';

describe('(Widgets common) DeploymentActions', () => {
    const wait = jest.fn(() => Promise.resolve());
    const doGetExecutions = jest.fn();

    beforeEach(() => {
        // @ts-expect-error Necessary when overriding
        Stage.Common = {
            PollHelper() {
                this.wait = wait;
            },
            ExecutionActions() {
                this.doGetExecutions = doGetExecutions;
            }
        };
    });

    it('waits for deployment to complete', () => {
        doGetExecutions.mockResolvedValueOnce({});
        doGetExecutions.mockResolvedValueOnce({ items: [{}] });

        const deploymentId = 'depId';

        return new DeploymentActions().waitUntilCreated(deploymentId).then(() => {
            expect(wait).toHaveReturnedTimes(2);
            expect(doGetExecutions).toHaveBeenCalledWith(deploymentId);
            expect(doGetExecutions).toHaveBeenCalledTimes(2);
        });
    });
});