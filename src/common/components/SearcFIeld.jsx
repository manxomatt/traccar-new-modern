// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";

// assets
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "../../common/components/LocalizationProvider";
// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export const filterByKeyword = (keyword) => (item) =>
  !keyword ||
  JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase());

const SearchField = ({ keyword, setKeyword, setTimestamp }) => {
  const t = useTranslation();
  return (
    <Box sx={{ width: "100%", ml: { xs: 0, md: 2 } }}>
      <FormControl sx={{ width: { xs: "100%", md: 524 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            "aria-label": "weight",
          }}
          placeholder={t("sharedSearch")}
          value={keyword}
          onChange={(e) => {
            if (e.target.value.length == 0 || e.target.value.length > 2) {
              setTimestamp(Date.now());
            }

            setKeyword(e.target.value);
          }}
        />
      </FormControl>
    </Box>
  );
};

export default SearchField;
