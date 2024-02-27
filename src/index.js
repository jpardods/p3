function startGame() {
    var username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    window.location.href = "game.html";
}
