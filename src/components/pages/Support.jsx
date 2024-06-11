import { Form } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";

const Support = () => {

  let user = useAuth()
  let email = user.currentUser.email

  return (
    <div>
      <Form>
        <div class="row mb-3">
          <label for="inputEmail3" class="col-sm-2 col-form-label">
            Email
          </label>
          <div class=" col-sm-4">
            <input type="email" class="form-control" id="inputEmail3" value={email}/>
          </div>
        </div>

        <fieldset class="row mb-3">
          <legend class="col-form-label pt-0">Based on your most recent experiences, how would you rate <span>Where's My Ice Cream?</span> on the following: </legend>
          <br/><div class="col-sm-10">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios1"
                value="option1"
                checked
              />
              <label class="form-check-label" for="gridRadios1">
                First radio
              </label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
              />
              <label class="form-check-label" for="gridRadios2">
                Second radio
              </label>
            </div>

            <div class="form-check disabled">
              <input
                class="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios3"
                value="option3"
                disabled
              />
              <label class="form-check-label" for="gridRadios3">
                Third disabled radio
              </label>
            </div>

          </div>
        </fieldset>

        <div class="row mb-3">
          <div class="col-sm-10 offset-sm-2">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="gridCheck1" />
              <label class="form-check-label" for="gridCheck1">
                Example checkbox
              </label>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          Submit Feedback
        </button>
      </Form>
    </div>
  );
};

export default Support;
