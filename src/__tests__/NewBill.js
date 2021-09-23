import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from "@testing-library/user-event"
import mockedFirestore from "../__mocks__/firestore"
import { ROUTES_PATH } from "../constants/routes.js"

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

  describe("When I submit the creation form", () => {
    test("Then I should be redirected to the bills page", () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      )
      const html = NewBillUI()
      const onNavigate = jest.fn()
      document.body.innerHTML = html
      new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      })
      const submitButton = screen.getByTestId("submit-new-bill")
      userEvent.click(submitButton)

      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"])
    })

    test("Then it should create the bill with the user inputed data", () => {
      const spy = jest.spyOn(mockedFirestore.bills(), "add")
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      )
      const html = NewBillUI()
      const onNavigate = jest.fn()
      document.body.innerHTML = html
      new NewBill({
        document,
        onNavigate,
        firestore: mockedFirestore,
        localStorage: window.localStorage,
      })

      const testData = {
        expenseType: "IT et électronique",
        expenseName: "test expanse name",
        date: "2020-06-24",
        amount: "156",
        vat: "12",
        pct: "42",
        commentary: "test the commentary field"
      }

      userEvent.selectOptions(
        screen.getByTestId("expense-type"),
        testData.expenseType
      )
      userEvent.type(screen.getByTestId("expense-name"), testData.expenseName)
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: testData.date },
      })
      userEvent.type(screen.getByTestId("amount"), testData.amount)
      userEvent.type(screen.getByTestId("vat"), testData.vat)
      userEvent.type(screen.getByTestId("pct"), testData.pct)
      userEvent.type(screen.getByTestId("commentary"), testData.commentary)

      userEvent.click(screen.getByTestId("submit-new-bill"))

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
