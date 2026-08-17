var trepeziumParallaxes = [
    2.282, 2.611, 2.5502, 2.6427, 2.4851, 2.5923, 2.6548, 1.9105, 2.5014, 2.5113
];
var trepeziumRAs = [
    83.82190603333, 83.81571742286, 83.81969609357, 83.81593917292, 83.8161587334, 83.81786633459, 83.81722494169, 83.82111241289, 83.8186095697, 83.81514703646
];
var trepeziumDECs = [
    -5.38793631614, -5.38608036575, -5.39033271044, -5.3873151943, -5.38386814341, -5.38793078976, -5.38521790118, -5.39279017464, -5.3897005033, -5.38234955363
];

function AttachTrepezium(){
    for(var i = 0; i < trepeziumDECs.length; i++){
        var unitPos = RadiansToPointOnSphere(EquitorialCoordsToRadians(trepeziumRAs[i], trepeziumDECs[i]));
        positions.push(unitPos[0] * (1 / (trepeziumParallaxes[i] * 0.001)) * 0.1); //x
        positions.push(unitPos[1] * (1 / (trepeziumParallaxes[i] * 0.001)) * 0.1); //y
        positions.push(unitPos[2] * (1 / (trepeziumParallaxes[i] * 0.001)) * 0.1); //z
        colors.push(1); //r
        colors.push(0); //g
        colors.push(0); //b
    }
}