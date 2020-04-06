(function () {
  function setupEventHandlers() {
    const onChangeErrMsg = (msgDiv) => {
      const element = document.querySelector(msgDiv);
      if (element !== null){
        element.innerHTML = "";
      }
    };
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const firstname = document.querySelector("#firstname");
    const lastname = document.querySelector("#lastname");
    const repassword = document.querySelector("#repassword");
    if (email != null) {
      document
        .querySelector("#email")
        .addEventListener("change", () => onChangeErrMsg(".emailErr-signin"));
      document
        .querySelector("#email")
        .addEventListener("change", () => onChangeErrMsg(".emailErr-signup"));
    }
    if (password != null) {
      document
        .querySelector("#password")
        .addEventListener("change", () =>
          onChangeErrMsg(".passwordErr-signin")
        );
      document
        .querySelector("#password")
        .addEventListener("change", () =>
          onChangeErrMsg(".passwordErr-signup")
        );
    }
    if (firstname != null) {
      document
        .querySelector("#firstname")
        .addEventListener("change", () =>
          onChangeErrMsg(".firstnameErr-signup")
        );
    }
    if (lastname != null) {
      document
        .querySelector("#lastname")
        .addEventListener("change", () =>
          onChangeErrMsg(".lastnameErr-signup")
        );
    }
    if (repassword != null) {
      document
        .querySelector("#repassword")
        .addEventListener("change", () =>
          onChangeErrMsg(".repasswordErr-signup")
        );
    }

    //Event on modify product page
    const modifyButtonList = Array.from(
      document.querySelectorAll("button[class^=id]")
    );
    if (modifyButtonList) {
      modifyButtonList.forEach((button) => {
        button.onclick = function () {
          document
            .querySelector(`.new-info-${button.className}`)
            .classList.remove("hide");
          button.classList.add("hide");
        };
      });
       /*  document.querySelector(`.no-change-${button.className}`).addEventListener('click', function () {
              button.classList.remove("hide");
              document
                .querySelector(`.new-info-${button.className}`)
                .classList.add("hide");
            });
      });*/  
    }
  }
  window.onload = setupEventHandlers;
})();
