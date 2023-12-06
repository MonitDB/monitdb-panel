import styled from 'styled-components'

export const GenericTableStyles = styled.div`
  width: 100%;
  margin-top: 20px;

  .table-container {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    border: 1px solid #ccc;

    td,
    th {
      border: 1px solid #ddd;
      padding: 8px;
    }
  }

  .scrollable-cell {
    height: 40px;
    max-height: 40px;
    overflow-y: auto;
    overflow-x: hidden;
    width: auto;
  }

  .pointer-cursor {
    cursor: pointer;
  }

  .pointer-cursor:hover {
    background-color: #f0f0f0;
  }
`
