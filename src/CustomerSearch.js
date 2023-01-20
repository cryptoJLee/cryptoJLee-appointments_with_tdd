import React, { useCallback, useEffect, useState } from "react";
import { searchParams } from "./builders/paramHelpers";

const defaultLimitPerPage = 10;
const CustomerRow = ({ customer, renderCustomerActions }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
    <td>{renderCustomerActions(customer)}</td>
  </tr>
);
const SearchButtons = ({
  handleNext,
  handlePrevious,
  noMoreData,
  isFirstPage
}) => (
  <menu>
    <li>
      <button
        onClick={handlePrevious}
        disabled={isFirstPage}
      >Previous</button>
    </li>
    <li>
      <button
        onClick={handleNext}
        disabled={noMoreData}
      >Next</button>
    </li>
  </menu>
);
const LimitButtons = ({
  values,
  currrentLimit,
  handleChangeLimit,
}) => (
  <menu>
    {
      values.map(value => (
        <li key={value}>
          <button
            onClick={() => handleChangeLimit(value)}
            className={value === currrentLimit ? "toggled" : ""}
          >{value}</button>
        </li>
      ))
    }
  </menu>
);

export const CustomerSearch = (
  { renderCustomerActions, limitPerPage }
) => {
  const [customers, setCustomers] = useState([]);
  const [lastRowIds, setLastRowIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(limitPerPage);
  useEffect(() => {
    const fetchData = async () => {
      const after = lastRowIds[lastRowIds.length - 1];
      const queryString = searchParams(
        ["after", after],
        ["searchTerm", searchTerm],
        ["limit", limit === defaultLimitPerPage ? 0 : limit]
      );
      const result = await global.fetch(`/customers${queryString}`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      });
      setCustomers(await result.json());
    }
    fetchData();
  }, [lastRowIds, searchTerm, limit]);

  const handleNext = useCallback(() => {
    const after = customers[customers.length - 1].id;
    setLastRowIds([...lastRowIds, after]);
  }, [customers, lastRowIds]);
  const handlePrevious = useCallback(
    () => setLastRowIds(lastRowIds.slice(0, -1)),
    [lastRowIds]
  );
  const noMoreData = customers.length < 10;
  const isFirstPage = lastRowIds.length === 0;
  const handleSearchTextChanged = (
    { target: { value } }
  ) => setSearchTerm(value);
  const handleChangeLimit = (newVal) => setLimit(newVal);
  return (
    <>
      <input
        value={searchTerm}
        onChange={handleSearchTextChanged}
        placeholder="Enter filter text" />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        noMoreData={noMoreData}
        isFirstPage={isFirstPage}
      />
      <LimitButtons
        values={[10, 20, 50, 100]}
        currrentLimit={limit}
        handleChangeLimit={handleChangeLimit}
      />
      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <CustomerRow
              customer={customer}
              key={customer.id}
              renderCustomerActions={renderCustomerActions}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}

CustomerSearch.defaultProps = {
  renderCustomerActions: () => { },
  limitPerPage: defaultLimitPerPage,
};