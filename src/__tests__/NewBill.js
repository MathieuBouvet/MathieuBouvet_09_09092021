import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from "@testing-library/user-event"
import mockedFirestore from "../__mocks__/firestore"

const spy = jest.spyOn(mockedFirestore.storage, "put")

describe("Given I am connected as an employee, on the new Bill page", () => {
  describe("When I upload file for the file input", () => {
    afterEach(() => {
      spy.mockClear()
    })

    test.each([
      ["png", "image/png"],
      ["jpg", "image/jpeg"],
      ["jpeg", "image/jpeg"],
    ])("It should accept %s files", (extension, type) => {
      const html = NewBillUI()
      document.body.innerHTML = html
      new NewBill({
        document,
        oonNavigate: () => null,
        firestore: mockedFirestore,
        localStorage: window.localStorage,
      })
      const testFile = new File(["test"], `test.${extension}`, {
        type,
      })

      const fileInput = screen.getByTestId("file")
      userEvent.upload(fileInput, testFile)
      expect(fileInput.files[0]).toStrictEqual(testFile)
      expect(spy).toHaveBeenCalledWith(testFile)
    })

    test.each([
      ["", ""],
      [".txt", "text/plain"],
    ])("It should not accept files with '%s' extension", (extension, type) => {
      const html = NewBillUI()
      document.body.innerHTML = html
      new NewBill({
        document,
        oonNavigate: () => null,
        firestore: mockedFirestore,
        localStorage: window.localStorage,
      })
      const testFile = new File(["test"], `test${extension}`, {
        type,
      })

      const fileInput = screen.getByTestId("file")
      userEvent.upload(fileInput, testFile)
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })
})
