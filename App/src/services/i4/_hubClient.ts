interface IHubClient {

    /**
    * Set this function with a "function(state: number){}" to receive the "onServerStateChanged" message from the hub.
    * Contract Documentation: ---
    * @param state {number} 
    * @return {void}
    */
    onServerStateChanged: (state: number) => void;
}