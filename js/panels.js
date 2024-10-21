document.getElementById('toggleButton').addEventListener('click', function() {
    var sidePanel = document.getElementById('sidePanel');
    sidePanel.classList.toggle('closed'); // 
});


function toggleUploadPanel() {
    var uploadPanel = document.getElementById('uploadPanel');
    uploadPanel.classList.toggle('open'); // Toggle the 'open' class to show or hide the panel
}
